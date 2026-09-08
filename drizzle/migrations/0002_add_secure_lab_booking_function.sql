CREATE OR REPLACE FUNCTION public.book_lab_test(
  p_lab_id uuid,
  p_lab_name text,
  p_test_name text,
  p_test_code text,
  p_price integer,
  p_slot_date date,
  p_slot_time text,
  p_collection_address text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_id uuid;
  slot_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO slot_id
  FROM public.lab_booking_slots
  WHERE lab_id = p_lab_id
    AND slot_date = p_slot_date
    AND slot_time = p_slot_time
    AND available = true
  FOR UPDATE;

  IF slot_id IS NULL THEN
    RAISE EXCEPTION 'This collection slot is no longer available';
  END IF;

  INSERT INTO public.lab_bookings (user_id, lab_id, lab_name, test_name, test_code, price, slot_date, slot_time, collection_address)
  VALUES (auth.uid(), p_lab_id, p_lab_name, p_test_name, NULLIF(p_test_code, ''), COALESCE(p_price, 0), p_slot_date, p_slot_time, p_collection_address)
  RETURNING id INTO booking_id;

  UPDATE public.lab_booking_slots SET available = false WHERE id = slot_id;
  RETURN booking_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.book_lab_test(uuid, text, text, text, integer, date, text, text) TO authenticated;