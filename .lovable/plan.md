
This is a very large scope — realistically 3–4 weeks of engineering. I'll break it into shippable phases so we can validate each before piling on the next. Please confirm the phase order (or tell me to compress).

## Phase 1 — Foundation (this turn)
- Enable Lovable Cloud (Supabase-backed auth, DB, storage).
- Auth: email/password + Google sign-in. Public `/auth` route. Managed `_authenticated` layout.
- DB schema + RLS + storage buckets (private) for:
  - `profiles` (patient info)
  - `prescriptions` (file + extracted JSON)
  - `lab_reports` (file + extracted JSON)
  - `medicine_reminders` (name, dose, schedule, before/after food)
  - `health_events` (timeline entries)
  - `user_roles` + `has_role()` (patient / pharmacy / admin)
- Storage buckets: `prescriptions`, `lab-reports` — private, per-user path policies.

## Phase 2 — Patient app
Routes under `_authenticated/`:
- `/app` Dashboard: latest prescription card, latest report card, next reminder, AI insights strip, big red Emergency button (tel: 108 + share location).
- `/app/upload-prescription` — upload → server fn calls Lovable AI (Gemini vision) → extract medicines, dosage, food timing, side effects (plain English) + disclaimer. Save file + JSON.
- `/app/upload-report` — upload → AI summarizes, flags abnormal values, suggests doctor questions.
- `/app/timeline` — chronological events (uploads, reminders taken).
- `/app/reminders` — CRUD + times + before/after food.
- `/app/profile` — name, DOB, blood group, allergies, emergency contact.
- Premium Apple-style UI reusing existing tokens; sidebar nav via shadcn sidebar.

## Phase 3 — Pharmacy Portal
- Pharmacy registration form + `pharmacies` table with `approved` flag (admin-approved before login access to portal).
- Layout `_authenticated/pharmacy/*` gated by `has_role('pharmacy')` + approval.
- Pages: Dashboard (KPIs + charts via recharts), Inventory (CRUD, CSV upload, low-stock/expiry alerts), Orders (status workflow), Customers, Analytics, Medicine Requests, Payments, Settings, Support.
- Tables: `pharmacies`, `inventory`, `orders`, `order_items`, `customers`, `payments`, `medicine_requests`, `delivery` — all with RLS scoped to `pharmacy_id`.
- AI: server fns for stock prediction, demand forecast, expiry alerts, sales insights (Gemini, using inventory + orders summaries).

## Phase 4 — Patient ↔ Pharmacy integration
- Medicine search across approved pharmacies with stock, distance (haversine), rating, ETA.
- Order placement flow from patient → pharmacy inbox.

## Technical notes
- Stack stays TanStack Start (not Next.js — the request said Next but the project is TanStack; I'll keep TanStack unless you want a rewrite).
- AI via Lovable AI Gateway, `google/gemini-3-flash-preview` for vision + text.
- All file uploads use signed URLs; AI runs in `createServerFn` with `requireSupabaseAuth`.
- Dark mode toggle, framer-motion for transitions, recharts for analytics.

## What I'll do right now if you approve
Execute **Phase 1 + Phase 2** end-to-end in this turn (auth, schema, storage, all 6 patient pages, AI prescription + report analysis). Phases 3 and 4 in follow-up turns because the pharmacy portal alone is ~15 screens and needs its own review cycle.

Reply "go" to start Phase 1+2, or tell me a different split (e.g. "pharmacy portal first", or "just auth + dashboard shell this turn").
