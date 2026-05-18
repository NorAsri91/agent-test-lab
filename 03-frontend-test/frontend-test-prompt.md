# Frontend/UI Test Prompt — MCTicket

> **Usage:** Paste this entire prompt into any AI coding agent.  
> **Goal:** Test the agent's ability to build a polished, production-quality React + TypeScript + Tailwind UI from a single spec.

---

You are an AI coding agent. Your task is to **build a single React component file** for a modern, responsive ticket dashboard UI for **MCTicket**, a SaaS ticketing/job-sheet system for computer repair shops.

Read the full spec first. Output one complete `.tsx` file. Do not create extra files. Do not install packages.

## Context

MCTicket helps computer repair shops track customer devices from drop-off to delivery. The dashboard is what shop managers and technicians see when they log in — it gives them an at-a-glance summary of shop activity and a filterable ticket list.

## Constraints (Read Carefully)

- **Single file only.** One `.tsx` file with the entire dashboard.
- **No backend, no database, no API calls.** All data is static/dummy.
- **No package installation.** Use only React, TypeScript, and Tailwind CSS classes.
- **No new UI libraries.** Do not import headless-ui, radix-ui, shadcn, or any component library. Pure Tailwind + React only.
- **No Next.js app, no routing, no server.** This is a standalone component file.
- **Keep it production-minded.** Readable, consistent, sensible. Avoid overengineering.

## Save Your Answer

Save your complete component to:

```
03-frontend-test/[agent-name].tsx
```

Examples:
- `03-frontend-test/deepseek-v4-pro.tsx`
- `03-frontend-test/glm-5p1.tsx`
- `03-frontend-test/qwen3p6-plus.tsx`

**Rules:**
- Do not modify other agents' `.tsx` files.
- Do not create a Next.js app or any config files.
- Do not run `npm install`.

## Brand / Style Direction

MCTicket is a **Modern Orange SaaS**. Every visual choice should reflect this.

| Property | Value / Direction |
|----------|-------------------|
| Primary color | **#F87941** (warm orange) |
| Secondary accent | Slightly darker orange / warm gray for contrast |
| Background | Light warm gray or soft off-white |
| Card style | Clean card-based layout |
| Border radius | **rounded-2xl** or **rounded-3xl** |
| Shadows | Soft shadows (shadow-sm, shadow-md — nothing harsh) |
| Typography | Modern, readable, professional but friendly |
| Tone | Professional and trustworthy, not playful or childish |

## Component Requirements

Your component must include all 10 sections below. Each section should be clearly identifiable in the rendered output.

### 1. Dashboard Header

A top-level header bar or section that includes:
- The MCTicket logo/name (text-based is fine).
- Current date (static date is fine — e.g., "Thursday, May 14, 2026").
- A simple user avatar/icon placeholder (initials circle or generic icon).
- Sticky or prominent at the top on mobile.

### 2. Summary Stat Cards

A horizontal row of stat cards showing key shop metrics. Use the dummy data to calculate:
- **Total Tickets** — total count in the dataset.
- **Open** — tickets still active (not delivered, not cancelled).
- **Overdue** — tickets past their due date and not completed.
- **Revenue** — sum of estimated costs, formatted as currency.

Each card should show a label, a number, and a subtle icon or color accent. Cards should wrap gracefully on narrow screens.

### 3. Ticket List / Ticket Table

Display each ticket in the dummy dataset as a row or card. At minimum, show:
- Ticket number (e.g., TKT-001)
- Customer name
- Device
- Issue summary
- Status badge
- Priority badge
- Assigned technician

On desktop, use a table layout. On mobile, switch to stacked cards (one per ticket).

### 4. Status Badges

Color-coded badges for each status. Use these exact status values and semantic colors:

| Status | Badge Color |
|--------|-------------|
| `new` | Blue |
| `diagnosing` | Indigo |
| `waiting_approval` | Amber/Yellow |
| `repairing` | Orange |
| `ready` | Green |
| `delivered` | Emerald |
| `cancelled` | Slate/Gray |

Badges should be pill-shaped and readable at small sizes.

### 5. Priority Badges

Color-coded badges for each priority level. Use these values:

| Priority | Badge Color |
|----------|-------------|
| `urgent` | Red (high visibility) |
| `high` | Orange/Amber |
| `normal` | Blue/Sky |
| `low` | Gray/Slate |

Priority badges should be visually distinct from status badges (different shape, border, or icon — pick one technique).

### 6. Technician Assignment Display

Each ticket row must show who is assigned:
- If assigned, show the technician's name with a small avatar/initials circle.
- If **unassigned**, show a distinct visual state — e.g., "Unassigned" text in a muted or dashed-out style, or an empty avatar with a question mark.

### 7. Search / Filter UI Mockup

Add a search bar and filter controls above the ticket list. These do **not** need to actually filter data — they are a UI mockup. Include:
- A text search input with placeholder text (e.g., "Search tickets...").
- At least two filter dropdowns (e.g., filter by Status, filter by Priority).
- A visible but non-functional "Filter" or "Apply" button.

Keep the filter bar clean and aligned with the dashboard width. On mobile, consider stacking or collapsing the filters.

### 8. Empty State

Design an empty state that displays when there are no tickets matching the current view. Include:
- A simple icon or illustration placeholder (inline SVG or emoji is acceptable).
- A friendly message (e.g., "No tickets found").
- A subtle sub-message (e.g., "Try adjusting your filters or check back later.").

The empty state should be centered and visually balanced. It should not look broken.

To demonstrate this state, include a toggle button somewhere in the header or filter bar that switches between the real ticket list and the empty state. Label it "Show Empty State" / "Show Tickets".

### 9. Mobile Responsive Layout

The dashboard must adapt to mobile viewports (down to ~360 px width):
- Stat cards wrap to 2 columns, then 1 column.
- Ticket table becomes stacked cards.
- Header stacks vertically (logo, date, user on separate lines).
- Filter bar stacks inputs vertically.
- Badges remain readable.
- No horizontal scrollbars on any section.

Use responsive Tailwind prefixes (`sm:`, `md:`, `lg:`) throughout. Do not use any CSS-in-JS or separate stylesheets.

### 10. Dummy / Static Ticket Data

Include a static dataset of **exactly 12 tickets** directly in the component file. The dataset must exercise:

- All 7 status values at least once.
- All 4 priority values at least once.
- At least 2 unassigned technicians (`assignedTechnician: null`).
- A mix of overdue, SLA-risk, and well-scheduled due dates.

Use realistic repair-shop data. Example devices: MacBook Pro, iPhone 14, Dell XPS, Samsung Galaxy, etc.

Here is the required TypeScript shape for each ticket:

```typescript
type TicketStatus = "new" | "diagnosing" | "waiting_approval" | "repairing" | "ready" | "delivered" | "cancelled";
type TicketPriority = "low" | "normal" | "high" | "urgent";

interface Ticket {
  id: string;
  ticketNo: string;
  customerName: string;
  device: string;
  issue: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  dueDate: Date;
  assignedTechnician: string | null;
  estimatedCost: number;
}
```

## Technical Requirements

- **React + TypeScript** — define proper types/interfaces, avoid `any`.
- **Tailwind CSS classes only** — use Tailwind utility classes for all styling.
- **Single file** — all types, data, sub-components, and the main component in one `.tsx` file.
- **Export the component as default** (`export default function Dashboard`).
- **No external dependencies** beyond React and Tailwind.
- **Clean, readable code** — consistent formatting, meaningful variable names, logical grouping.
- **Avoid overengineering** — no context providers, no reducers, no custom hooks unless truly needed. A simple `useState` for the empty-state toggle is sufficient.

## Deliverable

Provide the complete `.tsx` source code and save it as `03-frontend-test/[agent-name].tsx` using your own agent identifier in the filename.

**Respond now with your complete React component.**
