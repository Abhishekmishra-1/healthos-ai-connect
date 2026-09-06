CREATE TABLE public.lab_booking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid NOT NULL REFERENCES public.catalog_labs(id) ON DELETE CASCADE,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lab_id, slot_date, slot_time)
);
GRANT SELECT ON public.lab_booking_slots TO anon, authenticated;
GRANT ALL ON public.lab_booking_slots TO service_role;
ALTER TABLE public.lab_booking_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_booking_slots public read" ON public.lab_booking_slots FOR SELECT USING (true);
CREATE POLICY "lab_booking_slots staff write" ON public.lab_booking_slots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'superadmin'::app_role) OR public.has_role(auth.uid(),'lab'::app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'superadmin'::app_role) OR public.has_role(auth.uid(),'lab'::app_role));

CREATE TABLE public.lab_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lab_id uuid NOT NULL REFERENCES public.catalog_labs(id) ON DELETE RESTRICT,
  lab_name text NOT NULL,
  test_name text NOT NULL,
  test_code text,
  price integer NOT NULL DEFAULT 0,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  collection_address text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.lab_bookings TO authenticated;
GRANT ALL ON public.lab_bookings TO service_role;
ALTER TABLE public.lab_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_bookings owner read" ON public.lab_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lab_bookings owner create" ON public.lab_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lab_bookings owner update" ON public.lab_bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lab_bookings staff read" ON public.lab_bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'superadmin'::app_role) OR public.has_role(auth.uid(),'lab'::app_role));
CREATE INDEX lab_booking_slots_lookup ON public.lab_booking_slots (lab_id, slot_date, available);
CREATE INDEX lab_bookings_user_created ON public.lab_bookings (user_id, created_at DESC);