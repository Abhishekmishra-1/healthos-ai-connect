import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, Search, Pill, MapPin, Truck, ScanLine, Heart, RotateCcw, Star, Filter, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/medicine")({
  head: () => ({ meta: [
    { title: "Buy Medicine — MEDOOGLE AI" },
    { name: "description", content: "Compare medicines from nearby pharmacies and place a delivery order." },
    { property: "og:title", content: "Buy Medicine — MEDOOGLE AI" },
    { property: "og:description", content: "Compare medicines from nearby pharmacies and place a delivery order." },
  ] }),
  component: MedicinePage,
});

const MEDS = [
  { id: 1, name: "Paracetamol 500mg", generic: "Acetaminophen", brand: "Crocin", mrp: 32, price: 25, pack: "Strip of 15", pharmacy: "MedPlus Kothrud", distance: "1.2 km", stock: true, rating: 4.7 },
  { id: 2, name: "Metformin 500mg", generic: "Metformin HCl", brand: "Glycomet", mrp: 48, price: 39, pack: "Strip of 10", pharmacy: "Apollo Aundh", distance: "2.4 km", stock: true, rating: 4.6 },
  { id: 3, name: "Atorvastatin 10mg", generic: "Atorvastatin", brand: "Atorlip", mrp: 112, price: 87, pack: "Strip of 10", pharmacy: "Wellness Baner", distance: "3.1 km", stock: true, rating: 4.5 },
  { id: 4, name: "Amoxicillin 500mg", generic: "Amoxicillin", brand: "Mox", mrp: 78, price: 62, pack: "Strip of 10", pharmacy: "Noble Chemist", distance: "0.9 km", stock: false, rating: 4.4 },
  { id: 5, name: "Pantoprazole 40mg", generic: "Pantoprazole", brand: "Pan-40", mrp: 92, price: 71, pack: "Strip of 10", pharmacy: "MedPlus Kothrud", distance: "1.2 km", stock: true, rating: 4.6 },
  { id: 6, name: "Cetirizine 10mg", generic: "Cetirizine", brand: "Zyrtec", mrp: 28, price: 22, pack: "Strip of 10", pharmacy: "Apollo Aundh", distance: "2.4 km", stock: true, rating: 4.5 },
  { id: 7, name: "Vitamin D3 60K", generic: "Cholecalciferol", brand: "Uprise-D3", mrp: 145, price: 118, pack: "4 sachets", pharmacy: "Wellness Baner", distance: "3.1 km", stock: true, rating: 4.8 },
  { id: 8, name: "Azithromycin 500mg", generic: "Azithromycin", brand: "Azithral", mrp: 88, price: 69, pack: "Strip of 5", pharmacy: "Noble Chemist", distance: "0.9 km", stock: true, rating: 4.6 },
];

export function MedicinePage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "favorites" | "repeat">("all");
  const [favs, setFavs] = useState<Record<number, boolean>>({});
  const [cart, setCart] = useState<Record<number, number>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"cod" | "upi">("cod");

  const cartItems = MEDS.filter((m) => (cart[m.id] ?? 0) > 0);
  const itemCount = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);

  function openCheckout() {
    setOrderPlaced(false);
    setCheckoutOpen(true);
  }

  function placeOrder() {
    if (!address.trim()) return;
    setOrderPlaced(true);
    setCart({});
  }

  const list = useMemo(() => {
    let l = MEDS;
    if (q) l = l.filter((m) => (m.name + m.brand + m.generic).toLowerCase().includes(q.toLowerCase()));
    if (tab === "favorites") l = l.filter((m) => favs[m.id]);
    return l;
  }, [q, tab, favs]);

  if (checkoutOpen) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <button type="button" onClick={() => setCheckoutOpen(false)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to medicines
        </button>
        {orderPlaced ? (
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-glow">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span>
            <h1 className="mt-5 text-2xl font-semibold">Order placed successfully</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Your pharmacy will confirm the order shortly. You can track its status from Orders.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/patient/orders" className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow">View orders</Link>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold">Continue shopping</button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Complete your order</h1>
              <p className="mt-2 text-sm text-muted-foreground">Add a delivery address and choose how you want to pay.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <section className="rounded-3xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary"><MapPin className="h-5 w-5" /></span>
                    <div><h2 className="font-semibold">Delivery address</h2><p className="text-xs text-muted-foreground">Where should we deliver your medicines?</p></div>
                  </div>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, village / town, PIN code" rows={4} className="mt-4 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                </section>
                <section className="rounded-3xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary"><CreditCard className="h-5 w-5" /></span><h2 className="font-semibold">Payment method</h2></div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setPayment("cod")} className={`rounded-2xl border p-4 text-left ${payment === "cod" ? "border-primary bg-primary/5" : "border-border"}`}><p className="text-sm font-semibold">Cash on delivery</p><p className="mt-1 text-xs text-muted-foreground">Pay when your order arrives</p></button>
                    <button type="button" onClick={() => setPayment("upi")} className={`rounded-2xl border p-4 text-left ${payment === "upi" ? "border-primary bg-primary/5" : "border-border"}`}><p className="text-sm font-semibold">UPI on delivery</p><p className="mt-1 text-xs text-muted-foreground">Scan and pay at the doorstep</p></button>
                  </div>
                </section>
              </div>
              <section className="h-fit rounded-3xl border border-border/60 bg-card p-5">
                <h2 className="font-semibold">Order summary</h2>
                <div className="mt-4 space-y-3 border-b border-border/60 pb-4">
                  {cartItems.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate">{item.name} × {cart[item.id]}</span><span className="font-medium">₹{item.price * (cart[item.id] ?? 0)}</span></div>)}
                </div>
                <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-emerald-600">Free</span></div>
                <div className="mt-3 flex justify-between text-base font-semibold"><span>Total ({itemCount} items)</span><span>₹{subtotal}</span></div>
                <button type="button" onClick={placeOrder} disabled={!address.trim() || cartItems.length === 0} className="mt-5 w-full rounded-full gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50">Place order · ₹{subtotal}</button>
                {!address.trim() && <p className="mt-2 text-center text-xs text-muted-foreground">Enter your address to continue.</p>}
              </section>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Medicine</h1>
          <p className="mt-2 text-sm text-muted-foreground">Search, compare and order from nearby pharmacies.</p>
        </div>
        <Link to="/patient/upload-prescription" className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">
          <Upload className="h-4 w-4" /> Order via prescription
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicines, brands or salts"
            className="w-full rounded-2xl bg-secondary/60 py-2.5 pl-11 pr-4 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-primary/40" />
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          <ScanLine className="h-4 w-4" /> Scan barcode
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-2">
        {(["all", "favorites", "repeat"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${tab === t ? "gradient-brand text-white shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {t === "repeat" ? "Repeat order" : t}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((m) => (
          <div key={m.id} className="group flex gap-4 rounded-3xl border border-border/60 bg-card p-4 transition hover:shadow-glow">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-500">
              <Pill className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">Generic: {m.generic} · {m.pack}</p>
                </div>
                <button onClick={() => setFavs((f) => ({ ...f, [m.id]: !f[m.id] }))}
                  className="shrink-0 rounded-full p-1.5 hover:bg-secondary">
                  <Heart className={`h-4 w-4 ${favs[m.id] ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.pharmacy} · {m.distance}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {m.rating}</span>
                <span className="inline-flex items-center gap-1"><Truck className="h-3 w-3" /> 45 min</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-semibold">₹{m.price}</span>
                  <span className="ml-1 text-xs text-muted-foreground line-through">₹{m.mrp}</span>
                  <span className="ml-1 text-xs font-medium text-emerald-500">{Math.round(((m.mrp - m.price) / m.mrp) * 100)}% off</span>
                </div>
                {m.stock ? (
                  cart[m.id] ? (
                    <div className="flex items-center gap-2 rounded-full bg-secondary px-1">
                      <button onClick={() => setCart((c) => ({ ...c, [m.id]: Math.max(0, (c[m.id] ?? 0) - 1) }))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background">−</button>
                      <span className="text-sm font-semibold tabular-nums">{cart[m.id]}</span>
                      <button onClick={() => setCart((c) => ({ ...c, [m.id]: (c[m.id] ?? 0) + 1 }))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background">+</button>
                    </div>
                  ) : (
                    <button onClick={() => setCart((c) => ({ ...c, [m.id]: 1 }))}
                      className="rounded-full gradient-brand px-4 py-1.5 text-xs font-semibold text-white shadow-glow">Add</button>
                  )
                ) : (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">Out of stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.values(cart).some((v) => v > 0) && (
        <div className="sticky bottom-24 z-10 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-full gradient-brand px-5 py-3 text-white shadow-glow md:bottom-6">
          <div className="text-sm font-semibold">{Object.values(cart).reduce((a, b) => a + b, 0)} items in cart</div>
          <button type="button" onClick={openCheckout} className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur">Checkout →</button>
        </div>
      )}

      <div className="rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-secondary"><RotateCcw className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold">Repeat order</p>
            <p className="text-xs text-muted-foreground">Re-order your last month's medicines in one tap.</p>
          </div>
        </div>
      </div>
    </div>
  );
}