-- Add admin role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Catalog tables managed by admin (public read, admin write)
CREATE TABLE IF NOT EXISTS public.catalog_doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  city text,
  experience_years int DEFAULT 0,
  fee int DEFAULT 0,
  languages text,
  clinic text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_doctors TO anon, authenticated;
GRANT ALL ON public.catalog_doctors TO service_role;
ALTER TABLE public.catalog_doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_doctors read" ON public.catalog_doctors FOR SELECT USING (true);
CREATE POLICY "catalog_doctors admin write" ON public.catalog_doctors FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.catalog_pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  address text,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_pharmacies TO anon, authenticated;
GRANT ALL ON public.catalog_pharmacies TO service_role;
ALTER TABLE public.catalog_pharmacies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_pharmacies read" ON public.catalog_pharmacies FOR SELECT USING (true);
CREATE POLICY "catalog_pharmacies admin write" ON public.catalog_pharmacies FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.catalog_labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  address text,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_labs TO anon, authenticated;
GRANT ALL ON public.catalog_labs TO service_role;
ALTER TABLE public.catalog_labs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_labs read" ON public.catalog_labs FOR SELECT USING (true);
CREATE POLICY "catalog_labs admin write" ON public.catalog_labs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.catalog_hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  address text,
  phone text,
  emergency boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_hospitals TO anon, authenticated;
GRANT ALL ON public.catalog_hospitals TO service_role;
ALTER TABLE public.catalog_hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_hospitals read" ON public.catalog_hospitals FOR SELECT USING (true);
CREATE POLICY "catalog_hospitals admin write" ON public.catalog_hospitals FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.catalog_medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category text,
  price int DEFAULT 0,
  requires_prescription boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_medicines TO anon, authenticated;
GRANT ALL ON public.catalog_medicines TO service_role;
ALTER TABLE public.catalog_medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_medicines read" ON public.catalog_medicines FOR SELECT USING (true);
CREATE POLICY "catalog_medicines admin write" ON public.catalog_medicines FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.catalog_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  price int DEFAULT 0,
  home_collection boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_tests TO anon, authenticated;
GRANT ALL ON public.catalog_tests TO service_role;
ALTER TABLE public.catalog_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_tests read" ON public.catalog_tests FOR SELECT USING (true);
CREATE POLICY "catalog_tests admin write" ON public.catalog_tests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['catalog_doctors','catalog_pharmacies','catalog_labs','catalog_hospitals','catalog_medicines','catalog_tests'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS touch_%I ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER touch_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t, t);
  END LOOP;
END $$;