# MCTicket Planning Test Answer — Kimi K2 P5

## 1. Project Understanding

**What is MCTicket?**
A lightweight, web-based job-sheet system that digitizes the paper-based ticketing workflow for computer repair shops.

**Problem it solves:**
Eliminates lost paper job sheets, reduces customer inquiry calls, prevents double-booking, and provides visibility into repair pipeline status without messy Excel files.

**Primary users:**
- **Front desk staff** — intake devices, manage customer communication
- **Technicians** — view assigned repairs, update progress, log notes
- **Shop owners/managers** — oversee operations, track revenue, manage staff

**Typical workflow:**
```
Drop-off → Intake/Ticket Creation → Diagnosis → Repair/Parts → Quality Check → Customer Notification → Pickup/Payment → Archive
```

---

## 2. Recommended Modules

| Module | Purpose |
|--------|---------|
| **Ticketing Core** | Create, view, update repair tickets; status tracking |
| **Customer Management** | Store customer profiles, contact history, device ownership |
| **Device/Inventory** | Track devices, parts used, serial numbers |
| **Dashboard & Analytics** | Overview stats, queue visualization, simple reports |
| **Notifications** | SMS/email triggers for status updates (mock in prototype) |
| **Settings & Configuration** | Repair categories, status definitions, shop info |

---

## 3. User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Front Desk** | Create tickets, update customer info, mark ready-for-pickup, view all tickets | Delete tickets, view cost/pricing, access settings |
| **Technician** | View assigned tickets, update diagnosis/repair notes, change status, log parts used | Create new tickets, view customer payment info, delete records |
| **Owner/Manager** | Full access to all features, view reports, manage users, configure settings | — |
| **Customer (portal)** | View own ticket status only (future consideration, out of scope for prototype) | Modify anything |

---

## 4. Suggested Data Model / Tables

```
customers
  - id, name, phone, email, created_at
  - 1—M → tickets

tickets
  - id, customer_id, device_type, device_model, serial_number, 
    issue_description, status, priority, assigned_to, 
    created_at, updated_at, completed_at, estimated_cost, final_cost
  - M—M → parts_used (via ticket_parts)
  - M—1 → users (assigned_to)

ticket_notes
  - id, ticket_id, author, note_text, created_at
  - M—1 → tickets

parts_used (junction)
  - ticket_id, part_id, quantity, unit_cost

parts_inventory (reference table)
  - id, name, sku, unit_cost, stock_quantity

users
  - id, name, role, active
```

---

## 5. UI Pages / Routes

**Shared/All Roles:**
- `/` — Dashboard (queue overview, stats, quick search)
- `/tickets` — Ticket list (filterable by status, assignee)
- `/tickets/:id` — Ticket detail / job sheet (editable based on role)
- `/tickets/new` — Create new ticket wizard

**Front Desk + Owner:**
- `/customers` — Customer directory
- `/customers/:id` — Customer profile + ticket history

**Technician Focused:**
- `/my-tickets` — Assigned tickets only (technician view)

**Owner Only:**
- `/reports` — Simple analytics (tickets closed this week, revenue summary)
- `/settings` — Shop configuration, user management

---

## 6. Development Phases

### Phase 1: Core Ticket Flow (MVP)
- Dashboard with ticket queue
- Create ticket form
- Ticket detail view with status updates
- Static customer data

### Phase 2: Customer Management
- Customer list and profiles
- Link tickets to customers
- Customer search/autocomplete on ticket creation

### Phase 3: Technician Assignment
- User role simulation (toggle view)
- Assign tickets to technicians
- "My Tickets" filtered view

### Phase 4: Rich Job Sheet
- Notes/comments thread on tickets
- Parts logging (UI only)
- Status history/audit trail display

### Phase 5: Polish & Reporting
- Dashboard widgets (metrics)
- Simple reports page
- Print-friendly job sheet view

---

## 7. Risk List

| Risk | Impact | Mitigation/Clarification Needed |
|------|--------|--------------------------------|
| **Status workflow undefined** | Medium | Need to confirm: how many status states? Can techs move from "In Repair" to "Ready" or must QA step exist? |
| **Multi-device tickets** | Low | Does one ticket = one device always? Or can a customer drop off 3 devices on one ticket? |
| **Payment integration scope** | Medium | Is payment tracking required or just cost logging? Real payment processing out of scope per constraints. |
| **Device categorization** | Low | Need standardized device types/models or free-form text? |
| **Offline capability** | Medium | Shops may have poor internet. Is offline mode a future requirement? |
| **Data retention** | Low | How long to keep completed tickets? Auto-archive policy? |

---

## 8. What to Build First & Why

**First:** The ticket creation form and ticket detail/job sheet view.

**Why:** This is the core atomic unit of the entire system. If the team can intake a device and view its repair status, the shop can operate. Everything else (dashboards, customer management, reporting) builds around this foundation. A clickable prototype of these two pages immediately demonstrates value to shop owners.

---

## 9. What NOT to Do Yet

1. **Do not implement authentication or login pages** — use role-switching toggle only
2. **Do not create database migrations or SQL schemas** — static JSON data only
3. **Do not integrate SMS/email APIs** — mock notification UI only
4. **Do not build print-to-PDF or PDF export** — browser print styles sufficient for prototype
5. **Do not implement search/filter backend** — client-side filtering only
6. **Do not add multi-language or localization** — English only for prototype
7. **Do not design complex permission middleware** — simple role checks in UI layer
8. **Do not build mobile native app** — responsive web only
9. **Do not implement real-time updates/WebSockets** — manual refresh acceptable

---

*End of plan — structured for clarity and immediate prototyping focus.*