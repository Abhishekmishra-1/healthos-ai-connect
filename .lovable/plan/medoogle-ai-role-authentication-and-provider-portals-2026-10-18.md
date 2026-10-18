# MEDOOGLE AI role authentication and provider portals

## Goal
Repair role-based login and access without removing existing patient features, then add secure doctor and laboratory onboarding, profile verification, and laboratory test management.

## Work
1. **Trace and align access:** Confirm current auth and database behavior; make role redirects derive only from assigned database roles, cover all existing roles, preserve existing URLs, and enforce doctor/laboratory/admin boundaries in route guards and database policies.
2. **Provider data and private files:** Add doctor profiles, laboratory profiles, and laboratory-owned test records with account ownership, draft/submission/approval/rejection states, public visibility only after approval, and narrowly scoped row access. Set up private verification-document storage with per-owner/admin access and upload limits/type validation.
3. **Doctor portal:** Add separate registration entry and a sectioned profile workflow, draft save, verification submission, completion/status display, edit/resubmit, rejection reason, public preview, and logout while keeping appointments out unless already connected.
4. **Laboratory portal:** Add separate registration entry and dashboard for profile setup, verification documents, collection availability, and laboratory-owned test create/edit/search/activation and public preview. Preserve `/lab` and provide the requested `/laboratory` destination.
5. **Admin and patient surfaces:** Add secure review/approve/reject/request-correction and listing activation controls; only approved active providers/tests appear in patient discovery with public fees/prices.
6. **Verify:** Run the relevant tests, review build/runtime signals, and exercise available public/authenticated flows. Report which real backend scenarios could not be exercised if no suitable account/session is available.

## Technical approach
- Reuse Lovable Cloud auth and existing roles, profiles, route shells, catalog pages, and database structures where they fit; do not trust signup metadata to grant a role.
- Apply additive database changes through the managed migration workflow with explicit grants before RLS and ownership-scoped policies. Keep role assignment and verification actions server/database enforced.
- Store identity-linked provider details; never expose private contact data or verification files in public listings. Use private storage and authorization checks rather than public file URLs.
- Preserve current patient functionality and existing `/lab` links. Do not present demo rows or disconnected appointment/payment actions as live data.
