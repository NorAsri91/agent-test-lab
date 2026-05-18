# Code Review: TicketManagement.tsx

## Summary

The `TicketManagement.tsx` component has **12 bugs** that violate the user requirements in `requirements.md`. Below is a detailed breakdown.

## Bug List

### Bug 1: Missing Ticket Status — `cancelled` (req #2)

**Location**: `src/TicketManagement.tsx` — `TICKET_STATUSES` constant

**Problem**: The statuses are defined as `['new', 'diagnosing', 'waiting_parts', 'ready', 'completed']`. The required status `cancelled` is missing entirely from the data model and from the status filter dropdown.

```typescript
const TICKET_STATUSES = ['new', 'diagnosing', 'waiting_parts', 'ready', 'completed'];
// Missing: 'cancelled'
```

**Fix**: Add `'cancelled'` to `TICKET_STATUSES`.

---

### Bug 2: Missing Ticket Count — Only 10 Tickets Defined (req #1)

**Location**: `src/TicketManagement.tsx` — `ticketData` object

**Problem**: The data defines only 10 tickets (MC-1001 through MC-1010). The requirement specifies **at least 12 tickets**.

**Fix**: Add MC-1011 and MC-1012 entries covering the missing status/priority combinations (especially `cancelled` + `urgent` to test edge cases).

---

### Bug 3: Open Revenue Calculation Includes Completed Tickets (req #4)

**Location**: `src/TicketManagement.tsx` — `openRevenue` computation (line ~118)

**Problem**: The `openRevenue` variable sums `ticket.cost` across *all* tickets returned by `filteredTickets`, which includes `completed` (and potentially `cancelled`) tickets. Open revenue should only count tickets that are actively in the pipeline: statuses `new`, `diagnosing`, `waiting_parts`, or `ready`.

```tsx
const openRevenue = filteredTickets
  .filter((t) => t.status !== 'completed')
  .reduce((sum, t) => sum + t.cost, 0);
```

But because `cancelled` doesn't exist in the data, the real filter should be:

```tsx
const OPEN_STATUSES = ['new', 'diagnosing', 'waiting_parts', 'ready'];
const openRevenue = filteredTickets
  .filter((t) => OPEN_STATUSES.includes(t.status))
  .reduce((sum, t) => sum + t.cost, 0);
```

**Fix**: Explicitly whitelist statuses that count toward open revenue.

---

### Bug 4: Overdue Determination Logic Is Inverted (req #5)

**Location**: `src/TicketManagement.tsx` — `isOverdue` function (line ~125)

**Problem**: The overdue check uses `||` with `ticket.status !== 'completed'`, which means **any non-completed ticket is counted as overdue** regardless of its due date.

```tsx
const isOverdue = (ticket) =>
  new Date(ticket.displayDue) < today || ticket.status !== 'completed';
// ^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Already overdue if past due...  OR just because it isn't completed
```

The `||` should be `&&`: a ticket is only overdue if it is past due **AND** not yet completed.

```tsx
const isOverdue = (ticket) =>
  new Date(ticket.displayDue) < today && ticket.status !== 'completed';
```

**Fix**: Change `||` to `&&`.

---

### Bug 5: `displayDue` and `dueDate` Are Inconsistent (req #6)

**Location**: `src/TicketManagement.tsx` — `ticketData`

**Problem**: The display dates (`displayDue`) do not match the logic dates (`dueDate`). For example:

| Ticket | dueDate (logic) | displayDue (UI)    |
|--------|-----------------|--------------------|
| MC-1001 | 2026-05-12     | May 18, 2026       |
| MC-1002 | 2026-05-10     | May 18, 2026       |
| MC-1003 | 2026-05-14     | May 20, 2026       |

The overdue logic uses `displayDue`, but the user-visible "Due" dates shown on the card and the dates used internally differ. A ticket might appear not overdue on the UI (because `displayDue` is in the future) but the logic evaluates a different date.

**Fix**: Use a single source of truth — either derive `displayDue` from `dueDate` at render time, or ensure both fields always carry the same date value.

---

### Bug 6: Inline Styles Used (req #7)

**Location**: `src/TicketManagement.tsx` — dashboard header (line ~242)

**Problem**: Inline styles are present:

```tsx
<div className="flex items-baseline gap-3 mb-6" style={{ letterSpacing: '0.08em', minWidth: 980 }}>
```

The `style` prop violates the requirement that all styling come from TailwindCSS utility classes.

**Fix**: Replace with Tailwind equivalents, e.g.:

```tsx
<div className="flex items-baseline gap-3 mb-6 tracking-wider min-w-[980px]">
```

---

### Bug 7: Filter Is Applied Instantly — No Apply/Filter Button (req #9)

**Location**: `src/TicketManagement.tsx` — filter section (lines ~155-175)

**Problem**: The `TicketStatusFilter` component is a `<select>` whose `onChange` calls `setPriorityFilter` directly. There is no separate "Apply Filter" or "Filter" button. The filters apply immediately on every change, which violates requirement #9.

**Fix**: Replace instant filter application with deferred pattern:
1. Store filter selection in a temporary state.
2. Add a "Apply Filter" button.
3. Only update actual filter on button click.
4. (Bonus) Add a "Reset Filters" button that clears selections.

---

### Bug 8: `getPriorityClass` Logical AND Bug — Urgent Tickets Never Get Red Badge (req #14)

**Location**: `src/TicketManagement.tsx` — `getPriorityClass` (line ~140)

**Problem**: The first condition uses `&&` instead of `||`:

```tsx
if (priority === 'urgent' && priority === 'high') {
  return 'bg-red-500/20 text-red-400';
}
```

A `priority` string **cannot** simultaneously be `'urgent'` AND `'high'`. This condition is always `false`, so urgent tickets never receive the red `bg-red-500/20 text-red-400` styling. They fall through to the `normal` branch (amber) instead.

**Fix**: Change `&&` to `||`:

```tsx
if (priority === 'urgent' || priority === 'high') {
  return 'bg-red-500/20 text-red-400';
}
```

---

### Bug 9: `getStatusClass` Uses Semantically Confusing Colors (req #14 — distinct color coding)

**Location**: `src/TicketManagement.tsx` — `getStatusClass` (line ~148)

**Problem**: The color assignments don't match status semantics or standard conventions:
- `completed` is blue (`bg-blue-500/20 text-blue-400`) — typically green
- `ready` is red (`bg-red-500/20 text-red-400`) — red suggests urgency or error
- `waiting_parts` is green — green suggests success
- `diagnosing` is yellow — reasonable

**Fix**: Re-assign colors to match standard meaning:
```tsx
if (status === 'completed') return 'bg-green-500/20 text-green-400';
if (status === 'ready') return 'bg-blue-500/20 text-blue-400';
if (status === 'waiting_parts') return 'bg-yellow-500/20 text-yellow-400';
if (status === 'diagnosing') return 'bg-cyan-500/20 text-cyan-400';
```

---

### Bug 10: Priority Filter Compares Status to Priority (req #8)

**Location**: `src/TicketManagement.tsx` — filter logic (line ~161)

**Problem**: The priority filter dropdown's `onChange` handler sets `priorityFilter`, but the filtering logic then compares `ticket.status === priorityFilter`:

```tsx
if (priorityFilter) filtered = filtered.filter((t) => t.status === priorityFilter);
//                                                              ^^^^^^^^^^^^^^
// Should be: t.priority === priorityFilter
```

This compares **status** against the priority filter value, which does nothing useful (status values and priority values share no overlap since statuses include `'waiting_parts'` and `'ready'` while priorities are `'urgent'`, `'high'`, `'normal'`, `'low'`).

**Fix**: Change `t.status === priorityFilter` to `t.priority === priorityFilter`.

---

### Bug 11: `key` Uses Array Index Instead of `ticket.id` (req #12)

**Location**: `src/TicketManagement.tsx` — ticket card map (line ~190)

**Problem**:

```tsx
{filteredTickets.map((ticket, index) => (
  <TicketCard key={index} ticket={ticket} />
))}
```

Using array index as the React `key` causes incorrect DOM reconciliation when the list order changes (due to filtering or sorting), which leads to stale component state being attached to the wrong ticket.

**Fix**: Use the ticket's unique ID:

```tsx
{filteredTickets.map((ticket) => (
  <TicketCard key={ticket.id} ticket={ticket} />
))}
```

---

### Bug 12: Not Mobile Responsive (req #10)

**Location**: `src/TicketManagement.tsx` — multiple places

**Problem**: The component uses fixed widths that break on mobile screens:
- Search input: `className="... w-96 ..."` (384px fixed)
- Status filter: `className="... w-52 ..."` (208px fixed)
- Dashboard header: `style={{ minWidth: 980 }}`
- Grid: `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` — works on narrow screens but `w-96` search input overflows

**Fix**: Use responsive Tailwind utilities:
```tsx
// Search input
className="... w-full md:w-96 ..."
// Status filter
className="... w-full md:w-52 ..."
// Dashboard header
className="... tracking-wider min-w-0 md:min-w-[980px]"
```

## Bugs Not in Requirements But Worth Fixing

### Bonus: `workQueueHealth` Is Nonsensical

**Location**: `src/TicketManagement.tsx` — lines ~130-135

This object computes a "health" score from `openRevenue`, `avgRepairTime`, and `overdueCount` using arbitrary multiplications and `Math.pow()`. It is never displayed in the UI and serves no requirement. It should either be removed or properly integrated.

### Bonus: "New Ticket" Button Does Nothing

**Location**: `src/TicketManagement.tsx` — line ~248

```tsx
<button onClick={() => setShowEmpty(false)} ...>New Ticket</button>
```

Clicking this sets `showEmpty` to `false`, but the empty state component is only shown if `filteredTickets.length === 0 && showEmpty`. There's no "Create Ticket" form anywhere, so the button is dead code.
