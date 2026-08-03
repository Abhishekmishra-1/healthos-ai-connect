import { useState } from "react";
import { toast } from "sonner";
import { Loader2, LocateFixed, MapPin, Pencil, X } from "lucide-react";
import { useMyLocation, lookupPincode, reverseGeocode, type MyLocation } from "@/hooks/use-my-location";

/** Compact "where are you?" bar: GPS detect, PIN code, or typed address. */
export function LocationBar() {
  const { location, save } = useMyLocation();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState<"gps" | "pin" | null>(null);

  const label = location.city
    ? `${location.city}${location.pincode ? ` · ${location.pincode}` : ""}`
    : location.pincode || "Set your location";

  async function detect() {
    if (!("geolocation" in navigator)) {
      toast.error("Your phone did not allow location access.");
      return;
    }
    setBusy("gps");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const place = await reverseGeocode(latitude, longitude);
          const next: MyLocation = { ...place, latitude, longitude };
          await save(next);
          toast.success(`Location set to ${place.city || place.address || "your area"}`);
          setOpen(false);
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Could not read your location");
        } finally {
          setBusy(null);
        }
      },
      () => {
        setBusy(null);
        toast.error("Please allow location access, or enter your PIN code.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  async function savePin() {
    const code = pin.replace(/\D/g, "");
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit PIN code.");
      return;
    }
    setBusy("pin");
    try {
      const place = await lookupPincode(code);
      await save({
        city: place.city,
        state: place.state,
        pincode: code,
        address: address.trim() || place.area,
        latitude: null,
        longitude: null,
      });
      toast.success(`Location set to ${place.city}, ${place.state}`);
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not check this PIN code");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <MapPin className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Your location</p>
            <p className="truncate text-base font-semibold">{label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          {open ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {open ? "Close" : "Change"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={detect}
            disabled={busy !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-5 py-3 text-base font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {busy === "gps" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            Use my current location
          </button>
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputMode="numeric"
              placeholder="PIN code"
              aria-label="PIN code"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House / street / village (optional)"
              aria-label="Address"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={savePin}
            disabled={busy !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-base font-semibold hover:bg-secondary disabled:opacity-60"
          >
            {busy === "pin" && <Loader2 className="h-4 w-4 animate-spin" />} Save PIN code
          </button>
        </div>
      )}
    </div>
  );
}