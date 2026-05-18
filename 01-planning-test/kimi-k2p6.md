# MCTicket — Planning Answer (Kimi K2 P6)

---

## 1. Project Understanding

MCTicket is a lightweight web-based job-sheet system for computer repair shops. It replaces paper tickets and spreadsheets, letting staff track customer devices from drop-off through repair to pickup. A typical workflow is:

1. **Drop-off**: Front Desk creates a ticket, records customer + device details, prints or emails a receipt.
2. **Diagnosis & Repair**: Technicians view assigned tickets, update status, add notes/parts, and mark progress.
3. **Ready for Pickup**: Front Desk notifies the customer, records payment, and closes the ticket on collection.

**Users**: Shop owner, front-desk staff, technicians. Optionally customers (view-only status).

---

## 2. Recommended Modules

- **Ticketing**: Create, view, edit, and close repair tickets.
- **Customer Directory**: Search and manage customer contact history.
- **Device & Job Notes**: Log diagnostics, parts used, and technician comments.
- **Status Board / Queue**: Kanban or list view of tickets by status (New → In Progress → Ready → Closed).
- **Reporting (Lite)**: Simple counts (open tickets, revenue today, average turnaround).
- **Settings / Shop Config**: Status labels, priority levels, repair categories.

---

## 3. User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Owner / Admin** | Everything: manage users, config, view all reports, edit/close any ticket. | Nothing (full access). |
| **Front Desk** | Create tickets, update customer info, change status to "Ready / Closed", view customer directory. | Edit technician notes, delete tickets, change config. |
| **Technician** | View assigned tickets, update status, add notes/parts, mark "In Progress / Awaiting Parts". | Create new customers, close tickets (finalize), view revenue reports. |
| **Customer (optional)** | View own ticket status only (read-only). | Edit anything, view others' tickets. |

---

## 4. Suggested Data Model / Tables

- `customers` (id, name, phone, email, created_at) → 1—M → `tickets`
- `tickets` (id, customer_id, device_type, brand, model, serial, issue_description, status, priority, assigned_to, created_at, updated_at, closed_at)
- `ticket_notes` (id, ticket_id, author_id, note_type[diagnosis/part/update], content, created_at)
- `users` (id, name, role, email) — *dummy/static only, no auth*
- `repair_parts` (id, ticket_id, part_name, cost, quantity, added_by, created_at) — optional for later
- `shop_settings` (id, status_options, priority_options, categories) — single-row config

---

## 5. UI Pages / Routes

**Shared / Dashboard**
- `/` — Dashboard (open ticket count, ready for pickup, today's drop-offs)
- `/tickets` — Ticket list with filters (status, priority, assigned to)
- `/tickets/:id` — Ticket detail / job sheet (edit notes, update status, view history)
- `/tickets/new` — Create new ticket wizard
- `/customers` — Customer directory + search
- `/customers/:id` — Customer profile + linked tickets

**Technician**
- `/my-queue` — Tickets assigned to me (simplified view)

**Owner**
- `/settings` — Shop config, status labels, categories
- `/reports` — Lite summary (ticket volume, avg close time)

---

## 6. Development Phases

| Phase | Goal | Scope |
|-------|------|-------|
| **Phase 1** | Clickable Ticket Prototype | Ticket CRUD (static data), status board, ticket detail page. |
| **Phase 2** | Customer & Queue Flow | Customer directory, create-ticket wizard, technician "My Queue". |
| **Phase 3** | Notes & History | Add/edit notes on tickets, log status changes, view activity feed. |
| **Phase 4** | Search & Filters | Filter tickets by status/tech/date; search customers and tickets. |
| **Phase 5** | Lite Reporting | Dashboard stats, simple summary cards, export-ready views. |

---

## 7. Risk List

- **Scope creep**: Adding real auth, payments, or inventory too early will stall the prototype.
- **Status ambiguity**: Shops define "In Progress" differently; needs owner clarification on custom statuses.
- **Device variety**: Laptops, desktops, phones — forms may need very different fields.
- **Offline usage**: Paper is used because internet drops; a web prototype won't solve that yet.
- **Data migration**: If the shop already uses Excel, export/import is a future unknown.
- **Multi-location**: Unclear if this is for one shop or a chain; affects user and ticket scope.

---

## 8. What to Build First & Why

**Build the Ticket Detail / Job Sheet page first.** It is the heart of the product — every user (front desk and technician) will spend the majority of their time reading and updating this page. A strong, readable job sheet with clear status actions and a note history immediately demonstrates value and surfaces UI/UX flaws before scaling to lists and dashboards.

---

## 9. What NOT to Do Yet

1. Do not set up any database, ORM, or SQL migrations.
2. Do not implement login, registration, sessions, or any auth provider (NextAuth, Clerk, etc.).
3. Do not design or build an API layer, REST endpoints, or server-side routes.
4. Do not configure deployment, hosting, Docker, CI/CD, or environment variables.
5. Do not add real-time sync, WebSockets, or offline/PWA capabilities.
6. Do not build invoicing, payment integration, or accounting modules.
7. Do not create email/SMS notification services or external integrations.

---
