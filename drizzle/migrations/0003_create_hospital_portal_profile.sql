CREATE TABLE public.hospital_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_name text NOT NULL DEFAULT 'My Hospital',
  logo_path text,
  registration_number text,
  address text,
  phone text,
  email text,
  website text,
  established_year integer,
  facilities jsonb NOT NULL DEFAULT '{}'::jsonb,
  specializations text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.hospital_profiles TO authenticated;
GRANT ALL ON public.hospital_profiles TO service_role;

ALTER TABLE public.hospital_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital owners can read their profile"
  ON public.hospital_profiles FOR SELECT TO authenticated
  USING (
    owner_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Hospital owners can create their profile"
  ON public.hospital_profiles FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = auth.uid() AND public.has_role(auth.uid(), 'hospital'));

CREATE POLICY "Hospital owners and admins can update profiles"
  ON public.hospital_profiles FOR UPDATE TO authenticated
  USING (
    owner_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  )
  WITH CHECK (
    owner_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );