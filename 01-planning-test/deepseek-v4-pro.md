# MCTicket — Structured Plan (Deepseek V4 Pro)

## 1. Project Understanding

MCTicket is a digital ticketing system that replaces paper job sheets in computer repair shops. It tracks every device a customer brings in — from drop-off, through diagnosis and repair, to pickup and payment.

**Who uses it:** Shop owners, technicians, and front-desk staff.

**Typical workflow:**
1. *Drop-off* — Front desk registers the customer and device, logs the reported issue, prints a claim ticket.
2. *Diagnosis & repair* — Technician picks up the ticket, documents findings, performs repairs, adds parts/labor notes, and marks the job complete.
3. *Delivery* — Front desk notifies the customer, processes payment, and closes the ticket.

---

## 2. Recommended Modules

| Module | Purpose |
|---|---|
| **Ticketing** | Core job-sheet lifecycle: create, update, assign, track statuses |
| **Customer Directory** | Store and search customer contact info and device history |
| **Dashboard** | At-a-glance metrics: open tickets, overdue jobs, daily intake |
| **Inventory (future)** | Track parts used per repair, stock levels |
| **Reporting (future)** | Revenue summaries, technician performance, turnaround time |
| **Notifications (future)** | SMS/email alerts for status changes and pickup reminders |

---

## 3. User Roles & Permissions

**Owner**
- Can do: everything — create/edit/delete tickets, view reports, manage customers.
- Cannot do: nothing (full access).

**Technician**
- Can do: view assigned tickets, update ticket status, add repair notes and parts used.
- Cannot do: delete tickets, access financial reports, edit customer details.

**Front Desk**
- Can do: create new tickets, look up customers, mark tickets as delivered/paid.
- Cannot do: modify repair notes, assign technicians, access reports.

---

## 4. Suggested Data Model / Tables

- `customers` (id, name, phone, email, notes) **1→M** `tickets`
- `tickets` (id, customer_id, device_make, device_model, serial_number, issue_description, status, priority, created_at, updated_at, assigned_to)
- `ticket_status_history` (id, ticket_id, old_status, new_status, changed_by, changed_at)
- `repair_notes` (id, ticket_id, technician_id, note, created_at)
- `parts_used` (id, ticket_id, part_name, cost, quantity)
- `users` (id, name, role, email)

---

## 5. UI Pages / Routes

| Route | Page | Who Uses |
|---|---|---|
| `/` | Dashboard (open tickets, today's intake, overdue count) | All roles |
| `/tickets` | Ticket list with search/filter | All roles |
| `/tickets/:id` | Ticket detail / job sheet (status, notes, parts, customer info) | All roles |
| `/tickets/new` | Create new ticket form | Front desk, Owner |
| `/customers` | Customer directory with search | All roles |
| `/customers/:id` | Customer detail + ticket history | All roles |
| `/tickets/:id/notes` | Add/view repair notes | Technician, Owner |

---

## 6. Development Phases

**Phase 1 — Core Ticketing Prototype**
Build the ticket CRUD flow with dummy data: ticket list, ticket detail, create ticket form. All data is static JSON.

**Phase 2 — Customer Management**
Add customer directory, customer detail page, and link customers to tickets in the UI.

**Phase 3 — Dashboard & Status Workflow**
Add the dashboard with summary stats. Implement ticket status transitions (Open → In Progress → Repaired → Delivered).

**Phase 4 — Repair Notes & Parts**
Allow technicians to add repair notes and log parts used per ticket. Read-only views for other roles.

**Phase 5 — Role Views & Polish**
Add role-based view switching, filtering, and UI polish for demo readiness.

---

## 7. Risk List

- **Scope creep** — Without clear boundaries, the prototype could drift into building a real backend.
- **Data model rigidity** — Dummy data may not surface edge cases (e.g., one customer with 50 devices). Needs eventual migration plan.
- **Status workflow complexity** — Shop workflows vary wildly; a rigid status enum may not fit all shops.
- **Offline usage** — Repair shops may have unreliable internet. This prototype is web-only, which is an assumption that needs validation.
- **Unclear priority system** — The prompt does not define SLA or priority levels. Needs product owner input.
- **Mobile requirement unknown** — Technicians may need mobile access. Not addressed in prototype scope.

---

## 8. What to Build First & Why

**The ticket detail page (`/tickets/:id`).** It is the single most information-dense screen — it shows the customer, device, issue, status, repair notes, and parts used all in one place. Building this first forces the data model and UI structure to be right from the start, and it is the page every role visits most frequently.

---

## 9. What NOT to Do Yet

1. Do not set up a real database — stay with hardcoded JSON arrays.
2. Do not implement authentication (no login, no JWT, no session management).
3. Do not build an API layer — all data reads from static files or in-memory state.
4. Do not configure deployment pipelines — no Vercel, no Docker, no CI/CD.
5. Do not add real notifications — no email/SMS integration.
6. Do not build reports or analytics modules.
7. Do not create database migrations or seed scripts.
8. Do not write unit/integration tests — prototype is for visual validation only.
