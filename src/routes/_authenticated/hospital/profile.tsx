import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Globe2, Mail, MapPin, Phone, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalCard, PortalPageHeader } from "@/components/hospital/portal-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hospital/profile")({ component: HospitalProfilePage });

const facilityOptions = ["Emergency", "ICU", "Ambulance", "Pharmacy", "Laboratory", "Blood bank", "MRI", "CT scan", "X-ray"];
const specializationOptions = ["Cardiology", "Neurology", "Orthopedics", "Gynecology", "Pediatrics", "Dermatology", "General medicine", "Surgery"];
type Profile = { id?: string; owner_user_id?: string; hospital_name: string; registration_number: string; address: string; phone: string; email: string; website: string; established_year: string; facilities: Record<string, boolean>; specializations: string[] };

const blankProfile: Profile = { hospital_name: "", registration_number: "", address: "", phone: "", email: "", website: "", established_year: "", facilities: {}, specializations: [] };

function HospitalProfilePage() {
  const [profile, setProfile] = useState<Profile>(blankProfile);
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function load() {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      setUserId(user.user.id);
      const { data } = await supabase.from("hospital_profiles").select("*").eq("owner_user_id", user.user.id).maybeSingle();
      if (data) setProfile({ ...blankProfile, hospital_name: data.hospital_name ?? "", registration_number: data.registration_number ?? "", address: data.address ?? "", phone: data.phone ?? "", email: data.email ?? "", website: data.website ?? "", established_year: data.established_year?.toString() ?? "", facilities: (data.facilities as Record<string, boolean>) ?? {}, specializations: data.specializations ?? [] });
    }
    void load();
  }, []);
  function update(key: keyof Profile, value: string) { setProfile((current) => ({ ...current, [key]: value })); }
  function toggleSpecialization(value: string) { setProfile((current) => ({ ...current, specializations: current.specializations.includes(value) ? current.specializations.filter((item) => item !== value) : [...current.specializations, value] })); }
  async function save() {
    if (!userId || !profile.hospital_name.trim()) { toast.error("Add the hospital name before saving."); return; }
    setSaving(true);
    const payload = { owner_user_id: userId, hospital_name: profile.hospital_name.trim(), registration_number: profile.registration_number.trim() || null, address: profile.address.trim() || null, phone: profile.phone.trim() || null, email: profile.email.trim() || null, website: profile.website.trim() || null, established_year: profile.established_year ? Number(profile.established_year) : null, facilities: profile.facilities, specializations: profile.specializations };
    const { error } = await supabase.from("hospital_profiles").upsert(payload, { onConflict: "owner_user_id" });
    setSaving(false);
    if (error) toast.error("Profile could not be saved."); else toast.success("Hospital profile saved.");
  }
  return <><PortalPageHeader title="Hospital profile" description="Keep the information patients and your team rely on up to date." actions={<Button onClick={save} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save changes"}</Button>} />
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <PortalCard title="Organisation details" description="Basic details for your hospital record."><div className="grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">Hospital name</span><Input value={profile.hospital_name} onChange={(e) => update("hospital_name", e.target.value)} placeholder="CityCare Hospital" /></label><label><span className="mb-2 block text-xs font-medium">Registration number</span><Input value={profile.registration_number} onChange={(e) => update("registration_number", e.target.value)} placeholder="MH-2026-0001" /></label><label><span className="mb-2 block text-xs font-medium">Established year</span><Input type="number" value={profile.established_year} onChange={(e) => update("established_year", e.target.value)} placeholder="2008" /></label><label><span className="mb-2 block text-xs font-medium">Phone</span><div className="relative"><Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={profile.phone} onChange={(e) => update("phone", e.target.value)} placeholder="020 4000 2200" /></div></label><label><span className="mb-2 block text-xs font-medium">Email</span><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} placeholder="care@citycare.in" /></div></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">Address</span><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={profile.address} onChange={(e) => update("address", e.target.value)} placeholder="12 Baner Road, Pune, Maharashtra" /></div></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">Website</span><div className="relative"><Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={profile.website} onChange={(e) => update("website", e.target.value)} placeholder="https://citycare.in" /></div></label></div></PortalCard>
      <div className="space-y-6"><PortalCard title="Facilities" description="Select what your hospital offers."><div className="grid grid-cols-2 gap-2">{facilityOptions.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs"><input type="checkbox" checked={Boolean(profile.facilities[item])} onChange={(e) => setProfile((current) => ({ ...current, facilities: { ...current.facilities, [item]: e.target.checked } }))} className="accent-primary" />{item}</label>)}</div></PortalCard><PortalCard title="Specializations" description="Help patients find the right care."><div className="flex flex-wrap gap-2">{specializationOptions.map((item) => <Button key={item} type="button" size="sm" variant={profile.specializations.includes(item) ? "default" : "outline"} onClick={() => toggleSpecialization(item)}>{item}</Button>)}</div></PortalCard><div className="rounded-xl border border-primary/20 bg-primary/5 p-5"><Building2 className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold">A complete profile builds trust</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your details can power patient discovery, appointment confirmations, and internal workflows.</p></div></div>
    </div></>;
}