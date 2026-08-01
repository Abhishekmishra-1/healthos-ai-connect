CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  -- Never trust client-supplied signup metadata for privileges.
  -- Every new account is a patient; elevated roles are granted by admins only.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient'::public.app_role)
  ON CONFLICT DO NOTHING;

  requested_role := NULLIF(NEW.raw_user_meta_data->>'role', '');
  IF requested_role IS NOT NULL AND requested_role IN ('doctor','pharmacy','lab','hospital') THEN
    INSERT INTO public.role_requests (user_id, requested_role)
    VALUES (NEW.id, requested_role::public.app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TABLE IF NOT EXISTS public.role_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role public.app_role NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  UNIQUE (user_id, requested_role)
);

GRANT SELECT ON public.role_requests TO authenticated;
GRANT ALL ON public.role_requests TO service_role;
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Role requests self read" ON public.role_requests;
CREATE POLICY "Role requests self read" ON public.role_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Role requests admin read" ON public.role_requests;
CREATE POLICY "Role requests admin read" ON public.role_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Role requests admin update" ON public.role_requests;
CREATE POLICY "Role requests admin update" ON public.role_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Only existing admins may grant or revoke roles; nobody can self-assign.
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));