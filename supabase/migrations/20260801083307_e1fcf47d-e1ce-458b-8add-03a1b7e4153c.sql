REVOKE EXECUTE ON FUNCTION public.bootstrap_current_user() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;