# MCTicket Planning Response — GLM 5

## 1. Project Understanding

MCTicket is a web-based ticketing system for computer repair shops to track devices from drop-off to delivery. It replaces paper job sheets and spreadsheets with a centralized, digital workflow.

**Problem Solved:** Paper-based tracking is slow, error-prone, and makes it hard to find device history, contact customers, or see shop workload.

**Users:** Shop owners, technicians, and front-desk staff.

**Typical Workflow:**
1. Customer drops off device → Front desk creates ticket with device info and issue description
2. Ticket assigned to technician → Technician diagnoses, updates status, adds notes
3. Repair completed → Customer notified, payment collected, device returned
4. Ticket closed → History saved for future reference

---

## 2. Recommended Modules

| Module | Purpose |
|--------|---------|
| **Ticketing** | Core job sheet management — create, update, track repair tickets |
| **Customer Management** | Store customer contact info and repair history |
| **Device/Inventory** | Track devices being repaired and spare parts used |
| **Dashboard** | Summary view — active tickets, pending repairs, today's stats |
| **Reports** | Basic metrics — revenue, repair counts, turnaround time |

---

## 3. User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Owner** | Everything — view all tickets, edit/delete, manage users, view reports | — |
| **Technician** | View assigned tickets, update status, add notes, mark complete | Delete tickets, access reports, manage users |
| **Front Desk** | Create tickets, edit customer info, update basic ticket details, mark as picked up | Assign technicians, delete tickets, view reports |

---

## 4. Suggested Data Model / Tables

| Table | Primary Fields | Relationships |
|-------|----------------|---------------|
| `customers` | id, name, phone, email, address, created_at | 1 → M `tickets` |
| `tickets` | id, customer_id, device_type, device_brand, serial_number, issue_description, status, priority, created_at, completed_at, assigned_to | M → 1 `customers`, M → 1 `users` |
| `users` | id, name, email, role, created_at | 1 → M `tickets` (assigned) |
| `ticket_notes` | id, ticket_id, user_id, content, created_at | M → 1 `tickets` |
| `parts_used` | id, ticket_id, part_name, quantity, cost | M → 1 `tickets` |

---

## 5. UI Pages / Routes

**General:**
- `/` — Dashboard (active tickets, today's stats, quick actions)
- `/login` — Mock login (placeholder only)

**Tickets:**
- `/tickets` — Ticket list (filterable by status, assigned, date)
- `/tickets/new` — Create new ticket form
- `/tickets/:id` — Ticket detail / job sheet view
- `/tickets/:id/edit` — Edit ticket (limited by role)

**Customers:**
- `/customers` — Customer directory (searchable)
- `/customers/:id` — Customer profile + repair history

**Admin (Owner only):**
- `/admin/users` — Manage staff accounts
- `/admin/reports` — Basic metrics and reports

---

## 6. Development Phases

| Phase | Goal | Scope |
|-------|------|-------|
| **Phase 1** | Core ticketing UI prototype | Dashboard, ticket list, ticket detail page with dummy data |
| **Phase 2** | Customer management | Customer directory, customer profile, link to tickets |
| **Phase 3** | Ticket workflow actions | Status updates, notes, technician assignment UI |
| **Phase 4** | Admin features | User management UI, basic reports dashboard |
| **Phase 5** | Polish & refinement | Responsive design, status filters, search improvements |

---

## 7. Risk List

| Risk | Type |
|------|------|
| Unclear status workflow (what statuses are needed?) | Assumption |
| Part tracking scope — do shops need inventory management or just usage logging? | Unknown |
| Payment integration — is this in scope? | Unknown |
| Customer notification — email/SMS requirements unclear | Unknown |
| Mobile responsiveness priority — do technicians use phones on the floor? | Assumption |
| Data migration — do existing shops have paper records to digitize? | Unknown |

---

## 8. What to Build First & Why

**Build the Ticket Detail page (`/tickets/:id`) first.**

This is the core "job sheet" view where most work happens — technicians add notes, update status, and see device info. It's the single most-used screen. Starting here validates the core UX before building surrounding pages.

---

## 9. What NOT to Do Yet

1. **Do not set up database or ORM** — use hardcoded JSON data only
2. **Do not implement authentication** — mock login state is sufficient
3. **Do not create API routes or backend** — prototype is frontend-only
4. **Do not add payment processing** — out of scope for prototype
5. **Do not implement notifications (email/SMS)** — requires backend
6. **Do not deploy or configure hosting** — local development only
