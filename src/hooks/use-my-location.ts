import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MyLocation = {
  city: string;
  state: string;
  pincode: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
};

const KEY = "medoogle:location";

export const EMPTY_LOCATION: MyLocation = {
  city: "",
  state: "",
  pincode: "",
  address: "",
  latitude: null,
  longitude: null,
};

function read(): MyLocation {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY_LOCATION, ...(JSON.parse(raw) as MyLocation) } : EMPTY_LOCATION;
  } catch {
    return EMPTY_LOCATION;
  }
}

/** Looks up city/state for an Indian PIN code (India Post public API, no key needed). */
export async function lookupPincode(pincode: string) {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  if (!res.ok) throw new Error("Could not check this PIN code");
  const json = (await res.json()) as Array<{
    Status: string;
    PostOffice: Array<{ District: string; State: string; Name: string }> | null;
  }>;
  const office = json?.[0]?.PostOffice?.[0];
  if (!office) throw new Error("PIN code not found");
  return { city: office.District, state: office.State, area: office.Name };
}

/** Reverse geocodes GPS coordinates to a readable Indian address (OpenStreetMap, no key needed). */
export async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error("Could not read your location");
  const json = (await res.json()) as {
    display_name?: string;
    address?: Record<string, string>;
  };
  const a = json.address ?? {};
  return {
    city: a["city"] ?? a["town"] ?? a["village"] ?? a["state_district"] ?? a["county"] ?? "",
    state: a["state"] ?? "",
    pincode: a["postcode"] ?? "",
    address: json.display_name ?? "",
  };
}

export function useMyLocation() {
  const [location, setLocation] = useState<MyLocation>(EMPTY_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const local = read();
    setLocation(local);
    setHydrated(true);
    if (local.city || local.pincode) return;
    // Fall back to whatever is already stored on the profile.
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("city, state, pincode, address, latitude, longitude")
        .eq("id", u.user.id)
        .maybeSingle();
      if (!data) return;
      setLocation({
        city: data.city ?? "",
        state: data.state ?? "",
        pincode: data.pincode ?? "",
        address: data.address ?? "",
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      });
    })();
  }, []);

  /** Saves locally (instant) and to the patient profile (persistent). */
  const save = useCallback(async (next: MyLocation) => {
    setLocation(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage disabled — local copy is optional */
    }
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("profiles").upsert({
      id: u.user.id,
      city: next.city || null,
      state: next.state || null,
      pincode: next.pincode || null,
      address: next.address || null,
      latitude: next.latitude,
      longitude: next.longitude,
      updated_at: new Date().toISOString(),
    });
  }, []);

  return { location, save, hydrated };
}