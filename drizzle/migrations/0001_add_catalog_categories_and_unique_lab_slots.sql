ALTER TABLE public.catalog_hospitals ADD COLUMN IF NOT EXISTS category text DEFAULT 'General Hospital';
CREATE INDEX IF NOT EXISTS catalog_hospitals_city_active_idx ON public.catalog_hospitals (city, active);
CREATE UNIQUE INDEX IF NOT EXISTS lab_bookings_confirmed_slot_unique ON public.lab_bookings (lab_id, slot_date, slot_time) WHERE status = 'confirmed';