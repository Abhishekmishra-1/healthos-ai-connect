import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Truck, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/orders")({
  head: () => ({ meta: [{ title: "Orders — MEDOOGLE AI" }] }),
  component: OrdersPage,
});

const ORDERS = [
  { id: "HOS-8241", pharmacy: "MedPlus Kothrud", items: 3, total: 342, status: "Out for delivery", eta: "45 min", stage: 3 },
  { id: "HOS-8210", pharmacy: "Apollo Aundh", items: 5, total: 891, status: "Delivered", eta: "2 days ago", stage: 4 },
  { id: "HOS-8177", pharmacy: "Wellness Baner", items: 2, total: 214, status: "Delivered", eta: "1 week ago", stage: 4 },
];

const STAGES = ["Placed", "Confirmed", "Packed", "Out for delivery", "Delivered"];

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">Track your medicine, lab and consultation orders.</p>
      </div>

      <div className="grid gap-3">
        {ORDERS.map((o) => {
          const delivered = o.status === "Delivered";
          return (
            <div key={o.id} className="rounded-3xl border border-border/60 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><ShoppingBag className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold">Order #{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.pharmacy} · {o.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{o.total}</p>
                  <p className={`text-xs ${delivered ? "text-emerald-500" : "text-sky-500"}`}>{o.status}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-2">
                  {STAGES.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center gap-2">
                      <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] ${i <= o.stage ? "gradient-brand text-white shadow-glow" : "bg-secondary text-muted-foreground"}`}>
                        {i < o.stage ? <CheckCircle2 className="h-3 w-3" /> : i === o.stage && !delivered ? <Truck className="h-3 w-3" /> : i + 1}
                      </div>
                      {i < STAGES.length - 1 && <div className={`h-0.5 flex-1 rounded-full ${i < o.stage ? "gradient-brand" : "bg-secondary"}`} />}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  {STAGES.map((s) => <span key={s} className="w-12 text-center first:text-left last:text-right">{s}</span>)}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {o.eta}</span>
                <button className="rounded-full bg-secondary px-4 py-1.5 font-semibold hover:bg-secondary/70">View details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}