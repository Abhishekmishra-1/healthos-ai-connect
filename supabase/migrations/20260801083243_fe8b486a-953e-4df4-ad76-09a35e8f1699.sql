CREATE OR REPLACE FUNCTION public.bootstrap_current_user()
RETURNS public.app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  meta jsonb;
  requested text;
  current_role_value public.app_role;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT raw_user_meta_data, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1))
    INTO meta, requested
  FROM auth.users WHERE id = uid;

  INSERT INTO public.profiles (id, full_name)
  VALUES (uid, requested)
  ON CONFLICT (id) DO NOTHING;

  -- Every account starts as a patient; elevated roles are granted by admins only.
  INSERT INTO public.user_roles (user_id, role)
  SELECT uid, 'patient'::public.app_role
  WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = uid);

  requested := NULLIF(meta->>'role', '');
  IF requested IS NOT NULL AND requested IN ('doctor','pharmacy','lab','hospital') THEN
    INSERT INTO public.role_requests (user_id, requested_role)
    SELECT uid, requested::public.app_role
    WHERE NOT EXISTS (
      SELECT 1 FROM public.role_requests
      WHERE user_id = uid AND requested_role = requested::public.app_role
    );
  END IF;

  SELECT role INTO current_role_value
  FROM public.user_roles
  WHERE user_id = uid
  ORDER BY CASE role
    WHEN 'admin' THEN 1 WHEN 'doctor' THEN 2 WHEN 'pharmacy' THEN 3
    WHEN 'lab' THEN 4 WHEN 'hospital' THEN 5 ELSE 6 END
  LIMIT 1;

  RETURN current_role_value;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;

-- Backfill existing accounts that never got a profile / role.
INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1))
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'patient'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id)
ON CONFLICT DO NOTHING;