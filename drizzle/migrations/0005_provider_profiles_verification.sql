CREATE TABLE public.provider_doctor_profiles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_user_id uuid NOT NULL UNIQUE,
 full_name text NOT NULL DEFAULT '', profile_photo_path text, designation text, qualifications text,
 specialty text, expertise text, medical_category text,
 experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0), languages text, biography text,
 clinic_name text, practice_address text, city text, district text, state text, pincode text, maps_url text,
 online_available boolean NOT NULL DEFAULT false, in_person_available boolean NOT NULL DEFAULT false,
 available_days text, working_hours text, in_person_fee integer CHECK (in_person_fee IS NULL OR in_person_fee >= 0),
 online_fee integer CHECK (online_fee IS NULL OR online_fee >= 0), followup_fee integer CHECK (followup_fee IS NULL OR followup_fee >= 0),
 registration_number text, issuing_authority text, certificate_path text, additional_certificates jsonb NOT NULL DEFAULT '[]'::jsonb,
 registered_email text, phone text, preferred_contact text,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','incomplete','pending_verification','approved','rejected')),
 rejection_reason text, submitted_at timestamptz, reviewed_at timestamptz, reviewed_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.provider_doctor_profiles TO authenticated;
GRANT ALL ON public.provider_doctor_profiles TO service_role;
ALTER TABLE public.provider_doctor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_doctor_owner_select ON public.provider_doctor_profiles FOR SELECT TO authenticated USING (owner_user_id = auth.uid());
CREATE POLICY provider_doctor_owner_insert ON public.provider_doctor_profiles FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'doctor'::public.app_role) AND status = 'draft');
CREATE POLICY provider_doctor_owner_update ON public.provider_doctor_profiles FOR UPDATE TO authenticated USING (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'doctor'::public.app_role)) WITH CHECK (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'doctor'::public.app_role));
CREATE POLICY provider_doctor_admin_select ON public.provider_doctor_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role));
CREATE TRIGGER provider_doctor_touch_updated_at BEFORE UPDATE ON public.provider_doctor_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.provider_lab_profiles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_user_id uuid NOT NULL UNIQUE,
 lab_name text NOT NULL DEFAULT '', logo_path text, cover_path text, lab_type text, description text, services text,
 address text, city text, district text, state text, pincode text, maps_url text,
 home_collection boolean NOT NULL DEFAULT false, home_collection_areas text,
 home_collection_charge integer CHECK (home_collection_charge IS NULL OR home_collection_charge >= 0),
 opening_hours text, weekly_schedule text, business_phone text, business_email text, contact_person text,
 registration_number text, issuing_authority text, certificate_path text, accreditation_details text,
 accreditation_certificate_path text,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','incomplete','pending_verification','approved','rejected')),
 rejection_reason text, submitted_at timestamptz, reviewed_at timestamptz, reviewed_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.provider_lab_profiles TO authenticated;
GRANT ALL ON public.provider_lab_profiles TO service_role;
ALTER TABLE public.provider_lab_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_lab_owner_select ON public.provider_lab_profiles FOR SELECT TO authenticated USING (owner_user_id = auth.uid());
CREATE POLICY provider_lab_owner_insert ON public.provider_lab_profiles FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'lab'::public.app_role) AND status = 'draft');
CREATE POLICY provider_lab_owner_update ON public.provider_lab_profiles FOR UPDATE TO authenticated USING (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'lab'::public.app_role)) WITH CHECK (owner_user_id = auth.uid() AND public.has_role(auth.uid(),'lab'::public.app_role));
CREATE POLICY provider_lab_admin_select ON public.provider_lab_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role));
CREATE TRIGGER provider_lab_touch_updated_at BEFORE UPDATE ON public.provider_lab_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.is_provider_lab_published(p_lab_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.provider_lab_profiles p JOIN public.catalog_labs c ON c.id=p.id WHERE p.id=p_lab_id AND p.status='approved' AND c.active=true); $$;
GRANT EXECUTE ON FUNCTION public.is_provider_lab_published(uuid) TO anon, authenticated, service_role;

CREATE TABLE public.provider_lab_tests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lab_id uuid NOT NULL REFERENCES public.provider_lab_profiles(id) ON DELETE CASCADE,
 name text NOT NULL, category text, description text, price integer NOT NULL CHECK (price >= 0),
 discounted_price integer CHECK (discounted_price IS NULL OR discounted_price >= 0), sample_type text,
 fasting_instructions text, turnaround_time text, home_collection boolean NOT NULL DEFAULT false,
 home_collection_charge integer CHECK (home_collection_charge IS NULL OR home_collection_charge >= 0),
 prescription_required boolean NOT NULL DEFAULT false, active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_lab_tests TO authenticated;
GRANT SELECT ON public.provider_lab_tests TO anon;
GRANT ALL ON public.provider_lab_tests TO service_role;
ALTER TABLE public.provider_lab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_lab_tests_public_read ON public.provider_lab_tests FOR SELECT USING (active=true AND public.is_provider_lab_published(lab_id));
CREATE POLICY provider_lab_tests_owner_read ON public.provider_lab_tests FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.provider_lab_profiles p WHERE p.id=lab_id AND p.owner_user_id=auth.uid()));
CREATE POLICY provider_lab_tests_owner_write ON public.provider_lab_tests FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.provider_lab_profiles p WHERE p.id=lab_id AND p.owner_user_id=auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.provider_lab_profiles p WHERE p.id=lab_id AND p.owner_user_id=auth.uid()));
CREATE POLICY provider_lab_tests_admin_manage ON public.provider_lab_tests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role));
CREATE TRIGGER provider_lab_tests_touch_updated_at BEFORE UPDATE ON public.provider_lab_tests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.catalog_labs ADD COLUMN description text, ADD COLUMN services text, ADD COLUMN lab_type text, ADD COLUMN district text, ADD COLUMN state text, ADD COLUMN pincode text, ADD COLUMN maps_url text, ADD COLUMN home_collection boolean NOT NULL DEFAULT false, ADD COLUMN home_collection_areas text, ADD COLUMN home_collection_charge integer;
CREATE POLICY provider_catalog_labs_public_read ON public.catalog_labs FOR SELECT USING (active=true AND (NOT EXISTS (SELECT 1 FROM public.provider_lab_profiles p WHERE p.id=catalog_labs.id) OR public.is_provider_lab_published(id)));
CREATE OR REPLACE FUNCTION public.is_provider_doctor_published(p_doctor_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.provider_doctor_profiles p JOIN public.catalog_doctors c ON c.id=p.id WHERE p.id=p_doctor_id AND p.status='approved' AND c.active=true); $$;
GRANT EXECUTE ON FUNCTION public.is_provider_doctor_published(uuid) TO anon, authenticated, service_role;
CREATE POLICY provider_catalog_doctors_public_read ON public.catalog_doctors FOR SELECT USING (active=true AND (NOT EXISTS (SELECT 1 FROM public.provider_doctor_profiles p WHERE p.id=catalog_doctors.id) OR public.is_provider_doctor_published(id)));

CREATE OR REPLACE FUNCTION public.deactivate_provider_listing_on_profile_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid()=NEW.owner_user_id AND OLD.status='approved' AND NEW.status<>'approved' THEN
  IF TG_TABLE_NAME='provider_doctor_profiles' THEN UPDATE public.catalog_doctors SET active=false WHERE id=NEW.id;
  ELSE UPDATE public.catalog_labs SET active=false WHERE id=NEW.id; END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER provider_doctor_deactivate_on_edit AFTER UPDATE ON public.provider_doctor_profiles FOR EACH ROW EXECUTE FUNCTION public.deactivate_provider_listing_on_profile_change();
CREATE TRIGGER provider_lab_deactivate_on_edit AFTER UPDATE ON public.provider_lab_profiles FOR EACH ROW EXECUTE FUNCTION public.deactivate_provider_listing_on_profile_change();

CREATE OR REPLACE FUNCTION public.review_doctor_application(p_profile_id uuid,p_decision text,p_reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.provider_doctor_profiles%ROWTYPE;
BEGIN
 IF NOT (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role)) THEN RAISE EXCEPTION 'Not authorized'; END IF;
 IF p_decision NOT IN ('approve','reject') THEN RAISE EXCEPTION 'Invalid review decision'; END IF;
 SELECT * INTO p FROM public.provider_doctor_profiles WHERE id=p_profile_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Doctor application not found'; END IF;
 IF p_decision='approve' THEN
  IF p.status<>'pending_verification' OR nullif(trim(p.full_name),'') IS NULL OR nullif(trim(p.specialty),'') IS NULL OR nullif(trim(p.qualifications),'') IS NULL OR nullif(trim(p.registration_number),'') IS NULL OR nullif(trim(p.issuing_authority),'') IS NULL OR nullif(trim(p.certificate_path),'') IS NULL THEN RAISE EXCEPTION 'Doctor profile is incomplete or not awaiting verification'; END IF;
  UPDATE public.provider_doctor_profiles SET status='approved',rejection_reason=NULL,reviewed_at=now(),reviewed_by=auth.uid() WHERE id=p.id;
  INSERT INTO public.catalog_doctors(id,name,specialty,city,experience_years,fee,languages,clinic,active) VALUES(p.id,p.full_name,p.specialty,p.city,p.experience_years,coalesce(p.in_person_fee,p.online_fee,0),p.languages,coalesce(p.clinic_name,p.city),true)
  ON CONFLICT(id) DO UPDATE SET name=excluded.name,specialty=excluded.specialty,city=excluded.city,experience_years=excluded.experience_years,fee=excluded.fee,languages=excluded.languages,clinic=excluded.clinic,active=true,updated_at=now();
 ELSE
  IF nullif(trim(coalesce(p_reason,'')),'') IS NULL THEN RAISE EXCEPTION 'A reason is required'; END IF;
  UPDATE public.provider_doctor_profiles SET status='rejected',rejection_reason=trim(p_reason),reviewed_at=now(),reviewed_by=auth.uid() WHERE id=p.id;
  UPDATE public.catalog_doctors SET active=false WHERE id=p.id;
 END IF;
END; $$;
GRANT EXECUTE ON FUNCTION public.review_doctor_application(uuid,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.review_lab_application(p_profile_id uuid,p_decision text,p_reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.provider_lab_profiles%ROWTYPE;
BEGIN
 IF NOT (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role)) THEN RAISE EXCEPTION 'Not authorized'; END IF;
 IF p_decision NOT IN ('approve','reject') THEN RAISE EXCEPTION 'Invalid review decision'; END IF;
 SELECT * INTO p FROM public.provider_lab_profiles WHERE id=p_profile_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Laboratory application not found'; END IF;
 IF p_decision='approve' THEN
  IF p.status<>'pending_verification' OR nullif(trim(p.lab_name),'') IS NULL OR nullif(trim(p.address),'') IS NULL OR nullif(trim(p.city),'') IS NULL OR nullif(trim(p.business_phone),'') IS NULL OR nullif(trim(p.registration_number),'') IS NULL OR nullif(trim(p.issuing_authority),'') IS NULL OR nullif(trim(p.certificate_path),'') IS NULL THEN RAISE EXCEPTION 'Laboratory profile is incomplete or not awaiting verification'; END IF;
  UPDATE public.provider_lab_profiles SET status='approved',rejection_reason=NULL,reviewed_at=now(),reviewed_by=auth.uid() WHERE id=p.id;
  INSERT INTO public.catalog_labs(id,name,city,address,phone,active,category,description,services,lab_type,district,state,pincode,maps_url,home_collection,home_collection_areas,home_collection_charge)
  VALUES(p.id,p.lab_name,p.city,p.address,p.business_phone,true,p.lab_type,p.description,p.services,p.lab_type,p.district,p.state,p.pincode,p.maps_url,p.home_collection,p.home_collection_areas,p.home_collection_charge)
  ON CONFLICT(id) DO UPDATE SET name=excluded.name,city=excluded.city,address=excluded.address,phone=excluded.phone,active=true,category=excluded.category,description=excluded.description,services=excluded.services,lab_type=excluded.lab_type,district=excluded.district,state=excluded.state,pincode=excluded.pincode,maps_url=excluded.maps_url,home_collection=excluded.home_collection,home_collection_areas=excluded.home_collection_areas,home_collection_charge=excluded.home_collection_charge,updated_at=now();
 ELSE
  IF nullif(trim(coalesce(p_reason,'')),'') IS NULL THEN RAISE EXCEPTION 'A reason is required'; END IF;
  UPDATE public.provider_lab_profiles SET status='rejected',rejection_reason=trim(p_reason),reviewed_at=now(),reviewed_by=auth.uid() WHERE id=p.id;
  UPDATE public.catalog_labs SET active=false WHERE id=p.id;
 END IF;
END; $$;
GRANT EXECUTE ON FUNCTION public.review_lab_application(uuid,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE requested_role text := lower(coalesce(NEW.raw_user_meta_data->>'role',''));
BEGIN
 INSERT INTO public.profiles(id,full_name) VALUES(NEW.id,coalesce(NEW.raw_user_meta_data->>'full_name',NEW.raw_user_meta_data->>'name',split_part(NEW.email,'@',1))) ON CONFLICT(id) DO NOTHING;
 IF requested_role NOT IN ('doctor','lab') THEN requested_role:='patient'; END IF;
 INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,requested_role::public.app_role) ON CONFLICT DO NOTHING;
 IF requested_role IN ('doctor','lab') THEN INSERT INTO public.role_requests(user_id,requested_role) VALUES(NEW.id,requested_role::public.app_role) ON CONFLICT(user_id,requested_role) DO NOTHING; END IF;
 RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.bootstrap_current_user()
RETURNS public.app_role LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid:=auth.uid(); meta jsonb; nm text; requested text; current_role_value public.app_role;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
 SELECT raw_user_meta_data,coalesce(raw_user_meta_data->>'full_name',raw_user_meta_data->>'name',split_part(email,'@',1)) INTO meta,nm FROM auth.users WHERE id=uid;
 INSERT INTO public.profiles(id,full_name) VALUES(uid,nm) ON CONFLICT(id) DO NOTHING;
 requested:=lower(coalesce(meta->>'role',''));
 IF requested IN ('doctor','lab') AND NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=uid AND role=requested::public.app_role) THEN
  INSERT INTO public.user_roles(user_id,role) VALUES(uid,requested::public.app_role) ON CONFLICT DO NOTHING;
  INSERT INTO public.role_requests(user_id,requested_role) VALUES(uid,requested::public.app_role) ON CONFLICT(user_id,requested_role) DO NOTHING;
 ELSIF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=uid) THEN INSERT INTO public.user_roles(user_id,role) VALUES(uid,'patient'::public.app_role) ON CONFLICT DO NOTHING; END IF;
 SELECT role INTO current_role_value FROM public.user_roles WHERE user_id=uid ORDER BY CASE role WHEN 'superadmin' THEN 1 WHEN 'admin' THEN 2 WHEN 'doctor' THEN 3 WHEN 'lab' THEN 4 WHEN 'hospital' THEN 5 WHEN 'pharmacy' THEN 6 WHEN 'patient' THEN 7 ELSE 8 END LIMIT 1;
 RETURN current_role_value;
END; $$;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_provider_profile_review_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid()=OLD.owner_user_id THEN
  IF NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by THEN RAISE EXCEPTION 'Review fields are administrator-controlled'; END IF;
  IF NEW.status='approved' OR (NEW.status IS DISTINCT FROM OLD.status AND NEW.status NOT IN ('draft','incomplete','pending_verification')) THEN RAISE EXCEPTION 'Invalid provider status change'; END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER provider_doctor_guard_review BEFORE UPDATE ON public.provider_doctor_profiles FOR EACH ROW EXECUTE FUNCTION public.guard_provider_profile_review_fields();
CREATE TRIGGER provider_lab_guard_review BEFORE UPDATE ON public.provider_lab_profiles FOR EACH ROW EXECUTE FUNCTION public.guard_provider_profile_review_fields();

CREATE POLICY provider_documents_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id='provider-verification-documents' AND (auth.uid()::text=(storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'superadmin'::public.app_role)));
CREATE POLICY provider_documents_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='provider-verification-documents' AND auth.uid()::text=(storage.foldername(name))[1] AND lower(storage.extension(name)) IN ('pdf','png','jpg','jpeg'));
CREATE POLICY provider_documents_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='provider-verification-documents' AND auth.uid()::text=(storage.foldername(name))[1]) WITH CHECK (bucket_id='provider-verification-documents' AND auth.uid()::text=(storage.foldername(name))[1] AND lower(storage.extension(name)) IN ('pdf','png','jpg','jpeg'));
CREATE POLICY provider_documents_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='provider-verification-documents' AND auth.uid()::text=(storage.foldername(name))[1]);
NOTIFY pgrst,'reload schema';