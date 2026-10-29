create or replace function public.bootstrap_current_user()
returns public.app_role
language plpgsql
security definer
set search_path = public
as $$
DECLARE uid uuid:=auth.uid(); meta jsonb; nm text; requested text; current_role_value public.app_role;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
 SELECT raw_user_meta_data,coalesce(raw_user_meta_data->>'full_name',raw_user_meta_data->>'name',split_part(email,'@',1)) INTO meta,nm FROM auth.users WHERE id=uid;
 INSERT INTO public.profiles(id,full_name) VALUES(uid,nm) ON CONFLICT(id) DO NOTHING;
 requested:=lower(coalesce(meta->>'role',''));
 IF requested IN ('doctor','lab','pharmacy','hospital') AND NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=uid AND role=requested::public.app_role) THEN
  INSERT INTO public.user_roles(user_id,role) VALUES(uid,requested::public.app_role) ON CONFLICT DO NOTHING;
  INSERT INTO public.role_requests(user_id,requested_role) VALUES(uid,requested::public.app_role) ON CONFLICT(user_id,requested_role) DO NOTHING;
 ELSIF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=uid) THEN INSERT INTO public.user_roles(user_id,role) VALUES(uid,'patient'::public.app_role) ON CONFLICT DO NOTHING; END IF;
 SELECT role INTO current_role_value FROM public.user_roles WHERE user_id=uid ORDER BY CASE role WHEN 'superadmin' THEN 1 WHEN 'admin' THEN 2 WHEN 'doctor' THEN 3 WHEN 'lab' THEN 4 WHEN 'hospital' THEN 5 WHEN 'pharmacy' THEN 6 WHEN 'patient' THEN 7 ELSE 8 END LIMIT 1;
 RETURN current_role_value;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bootstrap_current_user() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;
NOTIFY pgrst, 'reload schema';

-- Test workspaces: let the owner's superadmin account switch into every portal.
insert into public.user_roles(user_id, role)
select '2817bc98-ecd6-4b16-bc23-2499c4434039'::uuid, r::public.app_role
from unnest(array['doctor','pharmacy','lab','hospital']) as r
on conflict do nothing;