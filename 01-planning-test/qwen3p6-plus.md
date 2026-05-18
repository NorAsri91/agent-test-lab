# MCTicket Planning Test — Qwen 3.6 Plus

---

## 1. Project Understanding

**MCTicket** is a lightweight, web-based ticketing and job-sheet system designed for computer repair shops. It replaces manual paper-based tracking and messy spreadsheets with a structured digital workflow.

**Users:**
- Shop owner/managers who need an overview of daily operations.
- Technicians who diagnose and repair devices.
- Front desk staff who handle customer drop-off/pickup.

**Typical workflow:**
1. **Drop-off:** Customer brings in a device. Front desk creates a ticket capturing device details, reported issue, and customer info. A unique ticket ID/QR code is generated.
2. **Repair:** Technician receives the ticket, updates diagnostic notes, changes status (e.g., "In Progress" → "Awaiting Parts" → "Repaired"), and tracks any parts used.
3. **Delivery:** Customer is notified the device is ready. Front desk marks the ticket as "Completed," collects payment, and hands over the device.

**Core problem solved:** Lost or forgotten job details, poor communication between staff, no central view of shop throughput.

---

## 2. Recommended Modules

| Module | Description |
|---|---|
| **Ticket Board** | Kanban-style view of all open/in-progress/completed tickets |
| **Ticket Detail & Job Sheet** | Single-ticket view with issue, diagnostics, status timeline, and notes |
| **Customer Directory** | List and detail view of past & current customers |
| **Parts & Inventory (Light)** | Simple list of common parts with stock-level indicators |
| **Notifications / SMS Stub** | Placeholder for customer alerts (status changes, ready for pickup) |
| **Settings** | Shop info, default statuses, user management stub |

---

## 3. User Roles & Permissions

| Role | Can | Cannot |
|---|---|---|
| **Owner** | View all tickets & customers, edit/delete any ticket, manage settings, see revenue summary | — (full access) |
| **Technician** | View assigned tickets, add diagnostic notes, change ticket status, log parts used | Delete tickets, access settings, modify customer data |
| **Front Desk** | Create tickets, view all tickets, update customer info, mark tickets completed | Edit technician diagnostic notes, delete tickets, access settings |

---

## 4. Suggested Data Model / Tables

| Table | Key Fields | Relationships |
|---|---|---|
| `customers` | id, name, phone, email, company (optional), created_at | 1—M → `tickets` |
| `tickets` | id, customer_id, device_type, device_brand, device_model, serial_no, issue_description, status, priority, created_at, updated_at, assigned_to (user_id), estimated_cost, final_cost, notes (text) | M—1 → `customers`<br>M—M → `parts` (via `ticket_parts`)<br>M—1 (optional) → `users` |

---

## 5. UI Pages / Routes

**All Roles:**
- `/` — Dashboard (today's stats: new, in-progress, completed, overdue)
- `/tickets` — Ticket list / board (filter by status, search)
- `/tickets/new` — Create ticket form
- `/tickets/:id` — Ticket detail / job sheet view
- `/customers` — Customer directory (search, paginate)
- `/customers/:id` — Customer detail + their ticket history
- `/settings` — Stub page (shop info, default statuses)

**Role-specific visibility** handled via UI-level show/hide in the prototype (no real auth).

---

## 6. Development Phases

| Phase | Goal | Scope |
|---|---|---|---|
| **Phase 1 — Ticket Board MVP** | Create a clickable UI prototype to visualize the core workflow | `/` dashboard, `/tickets` list, `/tickets/new` form, `/tickets/:id` detail — all with static dummy data |
| **Phase 2 — Customer Directory** | Link tickets to customers | `/customers` list, `/customers/:id` detail, customer creation flow |
| **Phase 3 — Role-Based Views** | Differentiate UI by role | Conditional rendering for Technician vs Front Desk vs Owner |
| **Phase 4 — Parts & Inventory Light** | Add parts tracking to ticket detail | Parts list, assign parts to tickets, update stock indicator |
| **Phase 5 — Polish & Settings** | Final UI refinements, settings stub, notification placeholder | Responsive design, status customization, print/export job sheet |

---

## 7. Risk List

| Risk | Impact | Mitigation / Clarification Needed |
|---|---|---|
| Over-scoping the prototype | Delivers too much too soon | Stick to dummy data and frontend only |
| Misidentifying the primary user | Wrong layout priorities | Clarify with shop owner: is it fast intake or technician notes that matter most? |
| Status workflow too rigid | Doesn't match real shop process | Keep statuses configurable; start with 4–5 defaults |
| Parts integration complexity | Adds backend-like logic early | Keep Phase 4 to a static list + visual assignment only |
| Printing / export requirements | May need PDF generation later | Note it; do not implement in prototype |

---

## 8. What to Build First & Why

**`/tickets` — Ticket list / kanban board** with a `/tickets/new` form.

This is the **core value loop** of MCTicket: shops create a ticket the moment a customer walks in. Getting this UI right first validates that the data model, workflow, and layout feel natural. Everything else (dashboard, customer directory, parts) branches out from tickets.

---

## 9. What NOT to Do Yet

1. **Do not set up authentication or login screens.** Use a role switcher toggle for the prototype.
2. **Do not create database migrations or SQL.** Use hardcoded JSON arrays as dummy data.
3. **Do not deploy to any environment (Vercel, Docker, etc).** This is a planning/prototyping exercise only.
4. **Do not implement form validation or error handling beyond UI-level placeholders.**
5. **Do not build notification systems (SMS/email/push).** Just add placeholder stubs on the ticket detail page.
6. **Do not optimize for responsiveness or accessibility beyond basic layout.** This can be addressed in Phase 5.
