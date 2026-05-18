# MCTicket Planning Response — Minimax M2 P7

## 1. Project Understanding

MCTicket is a web-based ticketing system for computer repair shops that replaces paper job sheets and Excel tracking. It solves the problem of tracking customer devices through the repair lifecycle — from initial drop-off through diagnosis, repair, and final delivery.

**Who uses it:** Front desk staff (check-in/check-out), technicians (update repair status), and shop owners (monitor workload and metrics).

**Typical workflow:**
1. Customer drops off device → front desk creates ticket
2. Technician receives assignment → diagnoses issue
3. Repair completed → customer notified
4. Customer picks up device → ticket closed

## 2. Recommended Modules

- **Ticketing** — Create, view, update, and close repair tickets
- **Customer Management** — Store customer contact info and device history
- **Device Tracking** — Log device details (type, brand, model, serial)
- **Status Workflow** — Manage ticket lifecycle (received → diagnosing → repairing → ready → delivered)
- **Assignment System** — Assign tickets to technicians
- **Dashboard** — Overview of shop metrics and pending work
- **Notifications** — Customer status updates (display-only in prototype)

## 3. User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Owner** | View all tickets, assign technicians, access dashboard, view all reports | — |
| **Technician** | View assigned tickets, update status/notes, mark repair complete | View other tech's tickets, reassign tickets |
| **Front Desk** | Create tickets, check-in/check-out devices, search customers | Update repair status, assign technicians |

## 4. Suggested Data Model / Tables

- `customers` (id, name, phone, email) — 1:M → tickets
- `devices` (id, customer_id, type, brand, model, serial, condition) — belongs to customer, 1:M → tickets
- `tickets` (id, customer_id, device_id, issue_description, status, priority, created_at, updated_at, assigned_to) — M:1 → customers, M:1 → technicians
- `technicians` (id, name, specialty, active)
- `status_log` (id, ticket_id, from_status, to_status, changed_by, changed_at) — M:1 → tickets

## 5. UI Pages / Routes

**Dashboard (all roles):**
- `/dashboard` — Stats overview: open tickets, ready for pickup, avg repair time

**Tickets:**
- `/tickets` — Ticket list with filters (status, date, tech)
- `/tickets/new` — Create new ticket form
- `/tickets/:id` — Ticket detail / job sheet view

**Customers:**
- `/customers` — Customer directory with search
- `/customers/:id` — Customer profile with device history

**Technicians:**
- `/technicians` — Technician list (owner only)
- `/technicians/:id` — Tech workload view (owner only)

## 6. Development Phases

1. **Phase 1 — Core Ticket Flow**
   - Ticket list view with static data
   - Ticket detail page with job sheet layout
   - Create ticket form

2. **Phase 2 — Customer & Device Data**
   - Customer directory with search
   - Customer profile with linked devices
   - Device info on ticket pages

3. **Phase 3 — Status & Assignment**
   - Status workflow controls
   - Technician assignment
   - Status history log

4. **Phase 4 — Dashboard & Polish**
   - Dashboard metrics
   - Role-based views
   - UI refinement

5. **Phase 5 — Notifications Display**
   - Status change notifications
   - Ready-for-pickup alerts

## 7. Risk List

- **Scope creep** — Risk of adding backend/auth before prototype is validated
- **Static data limitations** — Hardcoded JSON won't reflect real search/filter needs
- **Status workflow assumptions** — Need confirmation on exact status values and transitions
- **Role complexity** — Permission logic may need simplification for MVP
- **Unknown:** Should priority levels exist? Are there multiple device types per ticket?
- **Unknown:** How long should closed tickets be retained?

## 8. What to Build First & Why

**Ticket list page** should be built first. It's the central hub that every role touches daily, and building it validates the core data structure and UI patterns that all other pages will reuse.

## 9. What NOT to Do Yet

1. Do not set up any database or ORM
2. Do not implement authentication or role-based login
3. Do not create API routes or server-side logic
4. Do not deploy to any hosting platform
5. Do not build complex search or filtering logic — stick to static sample data
6. Do not create ticket history/versioning
7. Do not build email/SMS notification features