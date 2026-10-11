import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock3, FileText, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalCard, PortalPageHeader, SectionEmpty, StatusBadge } from "@/components/hospital/portal-shell";
import { hospitalAppointments } from "@/lib/hospital-portal-data";

export function HospitalAppointmentsPage() {
  return <>
    <PortalPageHeader title="Appointments" description="Coordinate consultations, follow-ups, and the day’s patient flow." actions={<Button><Plus className="mr-2 h-4 w-4" />New appointment</Button>} />
    <PortalCard title="Today · 48 appointments" description="Tuesday, 9 September 2026" action={<Button variant="outline" size="sm">Calendar view</Button>}>
      <div className="space-y-2">{hospitalAppointments.map((item) => <div key={`${item.time}-${item.patient}`} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><span className="w-12 text-sm font-semibold">{item.time}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.patient}</p><p className="text-xs text-muted-foreground">{item.doctor} · {item.department}</p></div><StatusBadge tone={item.status === "Checked in" ? "success" : item.status === "Waiting" ? "warning" : "info"}>{item.status}</StatusBadge><Button variant="ghost" size="sm">Open</Button></div>)}</div>
    </PortalCard>
  </>;
}

export function HospitalBedsPage() {
  const rooms = [{ name: "A Wing · Cardiology", total: 28, used: 24, type: "General" }, { name: "B Wing · Orthopedics", total: 24, used: 18, type: "General" }, { name: "C Wing · Critical care", total: 12, used: 10, type: "ICU" }, { name: "D Wing · Pediatrics", total: 18, used: 12, type: "Pediatric" }];
  return <><PortalPageHeader title="Beds & rooms" description="Monitor capacity and move patients through rooms with confidence." actions={<Button><Plus className="mr-2 h-4 w-4" />Add room</Button>} /><div className="grid gap-4 sm:grid-cols-2">{rooms.map((room) => <PortalCard key={room.name} title={room.name} description={`${room.type} care`}><div className="flex items-end justify-between"><div><p className="text-3xl font-bold">{room.total - room.used}</p><p className="text-xs text-muted-foreground">beds available</p></div><p className="text-sm font-semibold">{room.used} / {room.total}</p></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(room.used / room.total) * 100}%` }} /></div></PortalCard>)}</div></>;
}

export function HospitalRecordsPage() {
  return <><PortalPageHeader title="Medical records" description="Keep clinical documents and patient history easy for authorised teams to find." actions={<Button><FileText className="mr-2 h-4 w-4" />Upload record</Button>} /><PortalCard title="Recent record activity" description="Protected access is applied to every patient record."><div className="space-y-3">{["Discharge summary · Suresh Menon", "Cardiology ECG · Fatima Sheikh", "X-ray report · Ravi Kulkarni"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-lg border border-border p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span><div className="flex-1"><p className="text-sm font-medium">{item}</p><p className="text-xs text-muted-foreground">{index + 1} hour{index === 0 ? "" : "s"} ago · Clinical team</p></div><Button variant="ghost" size="sm">View</Button></div>)}</div></PortalCard></>;
}

export function HospitalLaboratoryPage() {
  return <><PortalPageHeader title="Laboratory" description="Track tests, samples, and reports across your diagnostic workflow." actions={<Button><Plus className="mr-2 h-4 w-4" />Create test order</Button>} /><div className="grid gap-4 sm:grid-cols-3"><Metric label="Samples today" value="36" detail="8 in processing" /><Metric label="Reports ready" value="21" detail="4 need review" /><Metric label="Average TAT" value="3.2h" detail="Down 18% this week" /></div><div className="mt-6"><PortalCard title="Test pipeline" description="Current laboratory activity"><SectionEmpty icon={Clock3} title="Sample workflow is ready" description="Connect your lab catalogue to start tracking collection, processing, and report delivery." /></PortalCard></div></>;
}

export function HospitalPharmacyPage() {
  return <><PortalPageHeader title="Pharmacy" description="Keep medicines, prescriptions, and dispensing work visible to the care team." actions={<Button><Plus className="mr-2 h-4 w-4" />Add medicine</Button>} /><PortalCard title="Pharmacy overview" description="Today’s stock and prescription activity"><div className="grid gap-4 sm:grid-cols-3"><Metric label="Orders today" value="42" detail="6 awaiting pickup" /><Metric label="Low stock items" value="8" detail="Review replenishment" /><Metric label="Prescriptions" value="67" detail="12 new today" /></div><div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm"><p className="font-semibold text-amber-700">8 items need attention</p><p className="mt-1 text-xs text-muted-foreground">Review stock thresholds before the evening shift.</p></div></PortalCard></>;
}

export function HospitalReviewsPage() {
  return <><PortalPageHeader title="Reviews" description="Listen to patient feedback and turn it into better care experiences." /><PortalCard title="Patient sentiment" description="Last 30 days"><div className="flex flex-wrap items-center gap-8"><div><p className="text-4xl font-bold">4.7</p><p className="mt-1 text-xs text-muted-foreground">Average rating</p></div><div className="h-12 w-px bg-border" /><div><p className="text-4xl font-bold">184</p><p className="mt-1 text-xs text-muted-foreground">Reviews received</p></div><div className="h-12 w-px bg-border" /><div><p className="text-4xl font-bold text-emerald-600">92%</p><p className="mt-1 text-xs text-muted-foreground">Positive sentiment</p></div></div></PortalCard></>;
}

export function HospitalNotificationsPage() {
  return <><PortalPageHeader title="Notifications" description="Important updates for the hospital team, all in one place." actions={<Button variant="outline">Mark all as read</Button>} /><PortalCard title="Recent notifications"><div className="space-y-2">{[{ title: "Critical care bed updated", detail: "Bed C-03 is now occupied by Fatima Sheikh.", tone: "danger" as const }, { title: "New appointment added", detail: "Asha Verma was booked with Dr. Nisha Iyer.", tone: "info" as const }, { title: "Daily report is ready", detail: "Your 8 September operations report is available.", tone: "success" as const }].map((item) => <div key={item.title} className="flex gap-3 rounded-lg border border-border p-4"><span className="mt-0.5"><CheckCircle2 className="h-4 w-4 text-primary" /></span><div className="flex-1"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div><StatusBadge tone={item.tone}>{item.tone === "danger" ? "Urgent" : "New"}</StatusBadge></div>)}</div></PortalCard></>;
}

export function HospitalSettingsPage() {
  return <><PortalPageHeader title="Settings" description="Control access, notifications, and how your hospital workspace behaves." /><div className="grid gap-6 md:grid-cols-2"><PortalCard title="Access & security" description="Keep your team protected"><div className="space-y-3">{["Require two-step verification", "Allow staff role requests", "Log patient record access"].map((label, index) => <label key={label} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm"><span>{label}</span><input type="checkbox" defaultChecked={index !== 1} className="accent-primary" /></label>)}</div></PortalCard><PortalCard title="Notifications" description="Choose what your team hears about"><div className="space-y-3">{["Emergency alerts", "Appointment changes", "Low stock reminders"].map((label) => <label key={label} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm"><span>{label}</span><input type="checkbox" defaultChecked className="accent-primary" /></label>)}</div></PortalCard></div></>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-lg border border-border p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>; }