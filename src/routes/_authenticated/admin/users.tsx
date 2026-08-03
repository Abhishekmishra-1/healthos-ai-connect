import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users — MEDOOGLE AI Admin" }] }),
  component: AdminUsers,
});

type Row = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  pincode: string | null;
  created_at: string;
  roles: string[];
};

function AdminUsers() {
  const [q, setQ] = useState("");
  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async (): Promise<Row[]> => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, phone, city, pincode, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      const byUser = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.role]);
      });
      return (profiles ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] }));
    },
  });

  const filtered = useMemo(() => {
    const list = users.data ?? [];
    if (!q.trim()) return list;
    const needle = q.toLowerCase();
    return list.filter((u) =>
      [u.full_name, u.phone, u.city, u.pincode, u.roles.join(" ")]
        .some((v) => String(v ?? "").toLowerCase().includes(needle)),
    );
  }, [q, users.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every registered account — open a user to view and edit their details, role and health data.
        </p>
      </div>

      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, city, PIN code or role…"
          aria-label="Search users"
          className="w-full rounded-2xl border border-border/60 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {users.isLoading && (
        <div className="grid place-items-center rounded-2xl border border-border/60 bg-card p-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {users.error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(users.error as Error).message}
        </p>
      )}

      {!users.isLoading && (
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    <Users className="mx-auto mb-2 h-5 w-5" /> No users match your search.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium">{u.full_name ?? "—"}</td>
                  <td className="px-4 py-3">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3">{[u.city, u.pincode].filter(Boolean).join(" · ") || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length === 0 && <span className="text-muted-foreground">—</span>}
                      {u.roles.map((r) => (
                        <span key={r} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold capitalize">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: u.id }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}