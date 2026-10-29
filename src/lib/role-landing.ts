/**
 * Single source of truth for role-based landing after sign-in.
 * The database's bootstrap_current_user() uses the same priority order.
 */
export const ROLE_DASHBOARDS: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  pharmacy: "/pharmacy/dashboard",
  lab: "/lab/dashboard",
  hospital: "/hospital/dashboard",
  admin: "/admin/dashboard",
  superadmin: "/admin/dashboard",
};

export const ROLE_PRIORITY: Record<string, number> = {
  superadmin: 1,
  admin: 2,
  doctor: 3,
  lab: 4,
  hospital: 5,
  pharmacy: 6,
  patient: 7,
};

/** Pick the highest-priority role from a list (fallback: patient). */
export function pickPrimaryRole(roles: string[]): string {
  if (!roles.length) return "patient";
  return [...roles].sort((a, b) => (ROLE_PRIORITY[a] ?? 9) - (ROLE_PRIORITY[b] ?? 9))[0];
}

/** Dashboard path for a role (fallback: patient dashboard). */
export function dashboardFor(role: string | null | undefined): string {
  return (role && ROLE_DASHBOARDS[role]) || "/patient/dashboard";
}

export const ROLE_LABELS: Record<string, string> = {
  patient: "Patient",
  doctor: "Doctor",
  pharmacy: "Pharmacy",
  lab: "Lab",
  hospital: "Hospital",
  admin: "Admin",
  superadmin: "Super Admin",
  nurse: "Nurse",
  staff: "Staff",
  receptionist: "Receptionist",
};
