CREATE TABLE public.hospital_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Staff',
  department text,
  active boolean NOT NULL DEFAULT true,
  fee integer,
  schedule text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hospital_staff TO authenticated;
GRANT ALL ON public.hospital_staff TO service_role;

ALTER TABLE public.hospital_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital teams can read their staff"
  ON public.hospital_staff FOR SELECT TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Hospital teams can add staff"
  ON public.hospital_staff FOR INSERT TO authenticated
  WITH CHECK (
    hospital_owner_id = auth.uid()
    AND public.has_role(auth.uid(), 'hospital')
  );

CREATE POLICY "Hospital teams can update staff"
  ON public.hospital_staff FOR UPDATE TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  )
  WITH CHECK (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Hospital teams can remove staff"
  ON public.hospital_staff FOR DELETE TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE TABLE public.hospital_booked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  doctor_name text,
  slot_type text NOT NULL DEFAULT 'appointment',
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hospital_booked_slots TO authenticated;
GRANT ALL ON public.hospital_booked_slots TO service_role;

ALTER TABLE public.hospital_booked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital teams can read booked slots"
  ON public.hospital_booked_slots FOR SELECT TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Hospital teams can add booked slots"
  ON public.hospital_booked_slots FOR INSERT TO authenticated
  WITH CHECK (
    hospital_owner_id = auth.uid()
    AND public.has_role(auth.uid(), 'hospital')
  );

CREATE POLICY "Hospital teams can update booked slots"
  ON public.hospital_booked_slots FOR UPDATE TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  )
  WITH CHECK (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Hospital teams can remove booked slots"
  ON public.hospital_booked_slots FOR DELETE TO authenticated
  USING (
    hospital_owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE TRIGGER touch_hospital_profiles
  BEFORE UPDATE ON public.hospital_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER touch_hospital_staff
  BEFORE UPDATE ON public.hospital_staff
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();