# Code Review: MCTicket Dashboard (Minimax M2 P7)

## 1. Executive Summary

This dashboard component has **11 tickets instead of 12**, missing status/priority options, broken filtering logic, incorrect calculations, semantic color inversions, and mismatched due dates. The priority filter checks `status` instead of `priority`. Open revenue includes completed tickets. Overdue logic uses `displayDue` instead of `dueDate`. The component fails multiple critical requirements and would not be acceptable for production use.

## 2. Critical Issues

### 2.1 Missing Tickets (Only 10 of 12)
**Lines 7-118**: The `tickets` array contains only 10 objects. Requirement #1 explicitly demands exactly 12 sample tickets.

### 2.2 Missing `cancelled` Status
**Lines 120-126**: `statusLabels` omits `cancelled`. The status filter dropdown (lines 238-243) also lacks this option. Requirement #2 requires covering all six statuses including `cancelled`.

### 2.3 Priority Filter Checks Wrong Field
**Line 161**:
```typescript
const matchesPriority = priorityFilter === 'all' || ticket.status === priorityFilter;
```
Uses `ticket.status` instead of `ticket.priority`. Filtering by priority is completely broken.

### 2.4 Open Revenue Includes Completed Tickets
**Line 167**:
```typescript
const openRevenue = tickets.reduce((sum: number, ticket: Ticket) => sum + ticket.estimate, 0);
```
Sums ALL tickets. Requirement #4 specifies excluding `completed` and `cancelled` tickets from open revenue calculation.

### 2.5 Overdue Logic Uses Wrong Date Field
**Line 170**:
```typescript
return new Date(ticket.displayDue) < today || ticket.status !== 'completed';
```
Uses `displayDue` (a mislabeled user-facing string) instead of `dueDate` (the actual logic date). Several tickets have mismatched values (e.g., MC-1001: dueDate `2026-05-12`, displayDue `May 18, 2026`). Also fails to exclude `cancelled` status.

### 2.6 Missing `low` Priority Option in Filter
**Lines 245-254**: Priority filter dropdown only has `normal`, `high`, `urgent`. Requirement #3 requires covering all four priorities, and filtering should include `low`.

## 3. Major Issues

### 3.1 Broken Priority Badge Logic
**Lines 137-139**:
```typescript
if (priority === 'urgent' && priority === 'high') {
  return 'bg-red-600 text-white';
}
```
This condition is impossible to satisfy—`priority` cannot equal both `urgent` AND `high` simultaneously. Urgent tickets get the default gray treatment instead of the red highlight required by Requirement #14.

### 3.2 Status Badge Colors Are Semantically Inverted
**Lines 128-134**:
- `ready` → red-100/red-700 (should be green for positive state)
- `waiting_parts` → green-100/green-700 (should be amber/yellow for pending)
- `completed` → blue-100/blue-700 (reasonable but conflicts with ready)

Requirement #13 requires semantic color matching. `ready` (pickup available) should be green, not red.

### 3.3 Due Date Display Mismatch
Multiple tickets have `dueDate` (logic) != `displayDue` (UI):
- MC-1001: dueDate `2026-05-12`, displayDue `May 18, 2026`
- MC-1002: dueDate `2026-05-17`, displayDue `May 14, 2026`
- MC-1007: dueDate `2026-05-10`, displayDue `May 21, 2026`

Requirement #6 requires displayed dates to match the dates used by the logic.

### 3.4 Missing Apply/Filter Button
**Lines 225-255**: Filters apply on `onChange` with no explicit button. Requirement #9 explicitly requires a visible Apply/Filter button.

### 3.5 Unstable List Keys
**Line 277**: Uses `key={index}` instead of `key={ticket.id}`. Violates Requirement #12 and causes incorrect React reconciliation on filter/sort operations.

### 3.6 Inline Style on Queue Health Div
**Line 259**: `style={{ letterSpacing: '0.08em', minWidth: 980 }}` is an inline style. Requirement #7 specifies Tailwind classes only for styling.

## 4. Minor Issues

### 4.1 TypeScript Type Is `any`
**Line 3**: `type Ticket = any;` defeats TypeScript benefits. Should be a proper interface.

### 4.2 `statusLabels` Missing `cancelled`
**Lines 120-126**: The record lacks a `cancelled` entry, causing fallback to raw status string.

### 4.3 `low` Priority Gets No Distinctive Styling
**Lines 145-146**: Low priority returns default gray styling with no visual distinction from other non-urgent priorities.

### 4.4 Priority Filter Excludes `low` Option
**Lines 251-253**: Only lists `normal`, `high`, `urgent` in dropdown.

### 4.5 "New Ticket" Button Has No Meaningful Action
**Lines 202-207**: Button sets `showEmpty(false)`—a toggle that does nothing visible. Should open a ticket creation form or modal per dashboard conventions.

### 4.6 Queue Health Display Is Cryptic
**Lines 173-189**: Computes arbitrary bucket labels like `rushish_6_06_wide | diagnosing_5_05_narrow` that convey no actionable information. Likely placeholder code that should be replaced with meaningful metrics.

## 5. Requirement Compliance Checklist

| # | Requirement | Status |
|---|------------|--------|
| 1 | Show exactly 12 sample tickets | **Fail** (only 10) |
| 2 | Cover all 6 statuses (new, diagnosing, waiting_parts, ready, completed, cancelled) | **Fail** (no cancelled) |
| 3 | Cover all 4 priorities (low, normal, high, urgent) | **Fail** (low missing from filter) |
| 4 | Calculate open revenue excluding completed/cancelled | **Fail** (includes all tickets) |
| 5 | Correct overdue calculation with real due date | **Fail** (uses displayDue, doesn't exclude cancelled) |
| 6 | Displayed dates match logic dates | **Fail** (multiple mismatches) |
| 7 | Tailwind only, no inline styles | **Fail** (line 259 has inline style) |
| 8 | Working empty state toggle | **Pass** (showEmpty state exists) |
| 9 | Visible Apply/Filter button | **Fail** (no button present) |
| 10 | Mobile responsive, usable on narrow screens | **Fail** (fixed 980px min-width, pixel columns) |
| 11 | Sound TypeScript types, avoid `any` | **Fail** (type is `any`) |
| 12 | Stable list keys | **Fail** (uses index instead of id) |
| 13 | Semantic status badge colors | **Fail** (colors are inverted) |
| 14 | Correct priority logic and visual treatment | **Fail** (urgent condition unreachable) |
| 15 | Clear implementation, not overbuilt | **Fail** (queue health is confusing) |

**Pass: 1 | Partial: 0 | Fail: 14**

## 6. TypeScript/React Review

- **Line 3**: `type Ticket = any` is unacceptable. Should define a proper interface with typed fields.
- **Lines 155-165**: `Ticket` parameter type annotation is redundant but harmless; the annotation on line 3 should be fixed instead.
- **Line 161**: Bug—uses `ticket.status` instead of `ticket.priority`.
- **Line 277**: Uses array index for key instead of `ticket.id`.
- **Line 290**: Uses `displayDue` for display but logic uses `dueDate`—inconsistency that causes wrong overdue detection.

## 7. UI/UX Review

- Status badge colors are semantically wrong: `ready` (positive) uses red, `waiting_parts` (pending) uses green.
- Priority highlighting is broken—urgent tickets get no distinctive visual treatment.
- Queue health section displays meaningless pseudo-random labels with underscores and numbers.
- "New Ticket" button has no actionable behavior.
- Filter dropdowns lack `completed`, `cancelled` status options and `low` priority option.
- No visible Apply button—filters change immediately on selection without confirmation.

## 8. Responsive Design Review

- **Line 259**: `minWidth: 980` forces horizontal scroll on narrow screens.
- **Line 265**: `grid-cols-[120px_180px_180px_1fr_130px_120px_110px]` uses fixed pixel widths that overflow on mobile.
- **Line 227**: Search input has `w-96` (384px) which is too wide for mobile.
- No responsive breakpoints for the table—single-row layout on mobile would be unreadable.
- Overall: Fails Requirement #10 for mobile usability.

## 9. Suggested Fixes

### Fix priority filter (line 161):
```typescript
const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
```

### Fix open revenue calculation (line 167):
```typescript
const openRevenue = tickets
  .filter((t: Ticket) => t.status !== 'completed' && t.status !== 'cancelled')
  .reduce((sum: number, ticket: Ticket) => sum + ticket.estimate, 0);
```

### Fix overdue logic (line 170):
```typescript
const overdueCount = tickets.filter((ticket: Ticket) => {
  return new Date(ticket.dueDate) < today && ticket.status !== 'completed' && ticket.status !== 'cancelled';
}).length;
```

### Fix priority badge (lines 137-139):
```typescript
if (priority === 'urgent') {
  return 'bg-red-600 text-white';
}
if (priority === 'high') {
  return 'bg-orange-100 text-orange-800';
}
```

### Fix status colors for `ready` (line 130):
```typescript
if (status === 'ready') return 'bg-green-100 text-green-700';
if (status === 'waiting_parts') return 'bg-yellow-100 text-yellow-700';
```

### Fix stable keys (line 277):
```typescript
key={ticket.id}
```

### Fix TypeScript type (line 3):
```typescript
interface Ticket {
  id: string;
  customer: string;
  device: string;
  issue: string;
  status: 'new' | 'diagnosing' | 'waiting_parts' | 'ready' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimate: number;
  dueDate: string;
  displayDue: string;
}
```

### Replace inline style with Tailwind (line 259):
```tsx
className="mb-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-500 tracking-[0.08em] min-w-[980px]"
```

### Add missing options to filters:
- Status filter: add `completed` and `cancelled` options
- Priority filter: add `low` option

### Add Apply/Filter button or integrate filters with a form element.

## 10. Final Verdict

**FAIL**

The component fails 14 of 15 requirements. Critical bugs include broken priority filtering (checking status field), incorrect revenue calculations, wrong overdue detection using mismatched date fields, missing statuses/priorities, and semantic color inversions. The implementation does not meet the baseline quality expected for MCTicket's dashboard widget.