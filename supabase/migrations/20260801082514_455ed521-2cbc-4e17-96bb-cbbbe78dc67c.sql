CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.catalog_doctors(id) ON DELETE SET NULL,
  doctor_name text NOT NULL,
  doctor_specialty text,
  clinic text,
  mode text NOT NULL DEFAULT 'video',
  fee integer NOT NULL DEFAULT 0,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  patient_name text,
  patient_phone text,
  reason text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (patient_id, doctor_name, slot_date, slot_time)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Appointments owner all" ON public.appointments
  FOR ALL TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Appointments admin read" ON public.appointments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER appointments_touch_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX appointments_patient_slot_idx ON public.appointments (patient_id, slot_date);