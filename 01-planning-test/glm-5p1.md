# MCTicket — Planning Test Answer (GLM 5.1)

---

## 1. Project Understanding

MCTicket is a web-based ticketing and job-sheet system for computer repair shops. It replaces paper job sheets and spreadsheets with a centralized digital workflow. The core problem: shops lose track of devices, repairs stall without status visibility, and customers get no updates. Users are shop owners, front-desk staff, and technicians. A typical workflow:

1. **Drop-off** — Front desk creates a ticket, logs customer info and device details, prints a receipt.
2. **Diagnosis** — Technician reviews the ticket, adds findings and a cost estimate.
3. **Approval** — Customer approves (or declines) the estimate via phone/in-shop.
4. **Repair** — Technician performs work, logs parts used and labor notes.
5. **Delivery** — Front desk marks ticket complete, collects payment, returns device.

---

## 2. Recommended Modules

| Module | Purpose |
|---|---|
| **Ticketing** | Create, view, update, close tickets (the core) |
| **Customer Management** | Customer directory, contact info, repair history |
| **Device Tracking** | Device details, serial numbers, accessories checked in |
| **Workflow / Status** | Status transitions, assignment, notifications |
| **Inventory** | Parts stock, usage tracking per repair |
| **Billing** | Cost estimates, final invoices, payment status |
| **Reporting** | Dashboard stats, average turnaround, revenue summaries |

---

## 3. User Roles & Permissions

### Owner
- **Can:** Full access — all tickets, reports, settings, billing, user management
- **Cannot:** N/A (superuser)

### Front Desk
- **Can:** Create tickets, update status (intake → ready for pickup), view all tickets, manage customer records, mark payment received
- **Cannot:** Assign technicians, edit repair notes, access settings or reports

### Technician
- **Can:** View assigned tickets, add diagnosis notes, update repair progress, log parts used, change status to "ready for pickup"
- **Cannot:** Create tickets, manage customers, access billing or other technicians' unassigned tickets

---

## 4. Suggested Data Model / Tables

- `customers` (id, name, phone, email, address, created_at) — 1→M `tickets`
- `tickets` (id, customer_id, device_id, status, issue_description, estimated_cost, final_cost, created_at, updated_at, closed_at)
- `devices` (id, customer_id, type, brand, model, serial, password_note, accessories) — M→1 `customers`; 1→M `tickets`
- `ticket_notes` (id, ticket_id, author_id, note_type [diagnosis/repair/internal], content, created_at) — M→1 `tickets`
- `users` (id, name, role [owner/front_desk/tech], email)
- `assignments` (id, ticket_id, user_id, assigned_at) — links tickets ↔ technicians
- `parts_used` (id, ticket_id, part_name, quantity, unit_price) — M→1 `tickets`
- `statuses` (id, ticket_id, status [intake/diagnosing/awaiting_approval/in_repair/ready_for_pickup/completed/cancelled], changed_at, changed_by)

---

## 5. UI Pages / Routes

### Shared
- `/login` — Placeholder login page (dummy auth)
- `/` — Dashboard (open tickets count, avg turnaround, recent activity)

### Tickets
- `/tickets` — Ticket list with filters (status, assigned, date range)
- `/tickets/new` — Create ticket (customer lookup + device info + issue)
- `/tickets/:id` — Ticket detail / job sheet view (status timeline, notes, parts, billing)

### Customers
- `/customers` — Customer directory (search, sort)
- `/customers/:id` — Customer detail (contact info, repair history)

### Inventory
- `/inventory` — Parts list with stock levels

### Reports (Owner only)
- `/reports` — Summary dashboard (revenue, ticket volume, turnaround times)

### Settings (Owner only)
- `/settings` — Shop info, user management, status workflow config

---

## 6. Development Phases

### Phase 1 — Ticket CRUD (Core Loop)
Goal: Create, view, and update a ticket with dummy data. Covers `/`, `/tickets`, `/tickets/new`, `/tickets/:id`. Static JSON, no backend.

### Phase 2 — Customer & Device Management
Goal: Customer directory and device tracking. Adds `/customers`, `/customers/:id`. Link customers to tickets in UI.

### Phase 3 — Status Workflow & Assignment
Goal: Visual status timeline on ticket detail. Technician assignment. Status transitions via buttons. Adds `/reports` skeleton.

### Phase 4 — Inventory & Billing
Goal: Parts usage per ticket, cost estimate / final invoice fields. Adds `/inventory`. Billing section on ticket detail.

### Phase 5 — Polish & Role Views
Goal: Role-based layout variations (technician sees only their queue, front desk sees intake view). `/settings` page. Refine dashboard stats.

---

## 7. Risk List

- **Ambiguous status flow** — Some shops may need custom statuses (e.g., "waiting for parts"). Needs product owner input on flexibility vs. simplicity.
- **Customer communication** — Is there SMS/email notification? Out of scope for prototype but affects data model.
- **Multiple devices per ticket** — Assumption: one device per ticket. If shops bundle repairs, the model changes.
- **Pricing model unknown** — Is this per-shop license, per-seat, or freemium? Affects which features are gated.
- **Print format** — Shops often print job sheets for physical handoff. Unknown if print layout is a priority.
- **Data sensitivity** — Device passwords and customer PII are stored. Security requirements unclear.

---

## 8. What to Build First & Why

**The ticket detail / job sheet page (`/tickets/:id`).** This is the single screen every role interacts with — front desk creates it, technicians update it, owners review it. Getting this page right defines the data model, status flow, and UX language for the entire app. Everything else is secondary.

---

## 9. What NOT to Do Yet

1. **Do not set up real authentication or NextAuth.** Use a dummy role selector.
2. **Do not create database migrations or ORM models.** Hardcoded JSON only.
3. **Do not build API routes or backend endpoints.** No server logic.
4. **Do not configure deployment (Vercel, Docker, CI/CD).** Local dev only.
5. **Do not implement real-time notifications (SMS, email, WebSocket).** Out of scope.
6. **Do not add payment gateway integration.** Payment status is a label, not a transaction.
7. **Do not build a print layout for job sheets.** Defer to a later phase.
