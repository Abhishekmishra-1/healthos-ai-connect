-- Grant superadmin to the app owner
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'superadmin'::public.app_role FROM auth.users WHERE email = 'avinashjain1228@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'avinashjain1228@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Only superadmin may manage group assignments
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Superadmin manages roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Role requests: superadmin reviews
DROP POLICY IF EXISTS "Role requests admin update" ON public.role_requests;
CREATE POLICY "Role requests superadmin update" ON public.role_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
DROP POLICY IF EXISTS "Role requests admin read" ON public.role_requests;
CREATE POLICY "Role requests staff read" ON public.role_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Catalog writes: admin or superadmin
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['catalog_doctors','catalog_pharmacies','catalog_labs','catalog_hospitals','catalog_medicines','catalog_tests']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || ' admin write', t);
    EXECUTE format($f$CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'))$f$, t || ' staff write', t);
  END LOOP;
END $$;

-- Admin-level read/update policies also honour superadmin
DROP POLICY IF EXISTS "Profiles admin read" ON public.profiles;
CREATE POLICY "Profiles admin read" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'));
DROP POLICY IF EXISTS "Profiles admin update" ON public.profiles;
CREATE POLICY "Profiles admin update" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'));

DROP POLICY IF EXISTS "Appointments admin read" ON public.appointments;
CREATE POLICY "Appointments admin read" ON public.appointments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'));
DROP POLICY IF EXISTS "Appointments admin manage" ON public.appointments;
CREATE POLICY "Appointments admin manage" ON public.appointments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'superadmin'));
