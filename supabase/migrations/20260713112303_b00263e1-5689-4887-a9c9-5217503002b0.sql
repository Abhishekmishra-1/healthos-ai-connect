-- Extend roles enum with all professional roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'doctor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pharmacy';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hospital';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Update signup handler to honor selected role from metadata (defaults to patient)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  selected_role public.app_role;
  role_text text;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  role_text := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
  BEGIN
    selected_role := role_text::public.app_role;
  EXCEPTION WHEN OTHERS THEN
    selected_role := 'patient'::public.app_role;
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, selected_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();