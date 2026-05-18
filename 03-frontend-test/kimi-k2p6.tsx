import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type TicketStatus =
  | "new"
  | "diagnosing"
  | "waiting_approval"
  | "repairing"
  | "ready"
  | "delivered"
  | "cancelled";

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

// ─── Static Data ─────────────────────────────────────────────────────────────
const today = new Date("2026-05-14T00:00:00");
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const ticketsData: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "James Wilson",
    device: "MacBook Pro 16\"",
    issue: "Screen flickering and external monitor not detected",
    status: "new",
    priority: "urgent",
    createdAt: addDays(today, -5),
    dueDate: addDays(today, -2),
    assignedTechnician: null,
    estimatedCost: 450.0,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Maria Garcia",
    device: "iPhone 14 Pro",
    issue: "Battery draining within 3 hours, needs replacement",
    status: "diagnosing",
    priority: "high",
    createdAt: addDays(today, -3),
    dueDate: addDays(today, 2),
    assignedTechnician: "Mike Chen",
    estimatedCost: 129.99,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Robert Taylor",
    device: "Dell XPS 13",
    issue: "Keyboard keys sticking after liquid spill",
    status: "waiting_approval",
    priority: "normal",
    createdAt: addDays(today, -4),
    dueDate: addDays(today, 1),
    assignedTechnician: "Sarah Johnson",
    estimatedCost: 275.5,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Lisa Anderson",
    device: "Samsung Galaxy S23",
    issue: "Broken charging port, won't charge wirelessly either",
    status: "repairing",
    priority: "urgent",
    createdAt: addDays(today, -6),
    dueDate: addDays(today, -1),
    assignedTechnician: "Mike Chen",
    estimatedCost: 189.0,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "David Martinez",
    device: "iPad Air M2",
    issue: "Cracked display, touch responsiveness degraded",
    status: "ready",
    priority: "high",
    createdAt: addDays(today, -7),
    dueDate: addDays(today, 3),
    assignedTechnician: "Sarah Johnson",
    estimatedCost: 340.0,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Jennifer Lee",
    device: "HP Spectre x360",
    issue: "Slow performance, suspected SSD failure",
    status: "delivered",
    priority: "low",
    createdAt: addDays(today, -10),
    dueDate: addDays(today, -3),
    assignedTechnician: "Mike Chen",
    estimatedCost: 520.0,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Thomas Brown",
    device: "Google Pixel 8",
    issue: "Camera module replacement after drop damage",
    status: "cancelled",
    priority: "normal",
    createdAt: addDays(today, -8),
    dueDate: addDays(today, -4),
    assignedTechnician: null,
    estimatedCost: 210.0,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Amanda White",
    device: "MacBook Air M3",
    issue: "Wi-Fi disconnects every 10 minutes",
    status: "new",
    priority: "low",
    createdAt: addDays(today, -2),
    dueDate: addDays(today, 5),
    assignedTechnician: "Sarah Johnson",
    estimatedCost: 175.0,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Kevin Patel",
    device: "Lenovo ThinkPad T14",
    issue: "BIOS password reset and RAM upgrade",
    status: "diagnosing",
    priority: "normal",
    createdAt: addDays(today, -3),
    dueDate: addDays(today, 0),
    assignedTechnician: "Mike Chen",
    estimatedCost: 145.0,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Rachel Kim",
    device: "iPhone 15 Pro Max",
    issue: "Water damage, won't power on after beach trip",
    status: "repairing",
    priority: "high",
    createdAt: addDays(today, -4),
    dueDate: addDays(today, -1),
    assignedTechnician: null,
    estimatedCost: 399.0,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Chris Evans",
    device: "Surface Laptop 5",
    issue: "Trackpad unresponsive, cursor jumping randomly",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: addDays(today, -2),
    dueDate: addDays(today, 0),
    assignedTechnician: "Sarah Johnson",
    estimatedCost: 230.0,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Sophie Turner",
    device: "ASUS ROG Zephyrus",
    issue: "GPU thermal throttling under load, needs repaste",
    status: "ready",
    priority: "normal",
    createdAt: addDays(today, -5),
    dueDate: addDays(today, 4),
    assignedTechnician: "Mike Chen",
    estimatedCost: 155.0,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusMeta: Record<
  TicketStatus,
  { label: string; bg: string; text: string; ring: string }
> = {
  new: {
    label: "New",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
  diagnosing: {
    label: "Diagnosing",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
  },
  waiting_approval: {
    label: "Waiting Approval",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  repairing: {
    label: "Repairing",
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-200",
  },
  ready: {
    label: "Ready",
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
  },
};

const priorityMeta: Record<
  TicketPriority,
  { label: string; bg: string; text: string; border: string }
> = {
  urgent: {
    label: "Urgent",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-300",
  },
  high: {
    label: "High",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  normal: {
    label: "Normal",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-300",
  },
  low: {
    label: "Low",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-300",
  },
};

const isOverdue = (ticket: Ticket) =>
  ticket.dueDate < today &&
  ticket.status !== "delivered" &&
  ticket.status !== "cancelled";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TicketStatus }) {
  const m = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${m.bg} ${m.text} ${m.ring}`}
    >
      {m.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const m = priorityMeta[priority];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${m.bg} ${m.text} ${m.border}`}
    >
      {priority === "urgent" && (
        <svg
          className="mr-1 h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {m.label}
    </span>
  );
}

function TechnicianPill({
  technician,
}: {
  technician: string | null;
}) {
  if (!technician) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-300 text-[10px] font-bold text-slate-400">
          ?
        </span>
        Unassigned
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F87941] text-[10px] font-bold text-white shadow-sm">
        {initials(technician)}
      </span>
      {technician}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "orange" | "blue" | "red" | "green";
}) {
  const accentMap = {
    orange: "bg-[#F87941]/10 text-[#F87941]",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="flex-1 min-w-[140px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accentMap[accent]}`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {accent === "orange" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            )}
            {accent === "blue" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            )}
            {accent === "red" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            )}
            {accent === "green" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-800 sm:text-3xl">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 px-4 text-center shadow-sm ring-1 ring-slate-100 sm:py-20">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
        <svg
          className="h-8 w-8 text-[#F87941]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">
        No tickets found
      </h3>
      <p className="mb-6 max-w-xs text-sm text-slate-500">
        Try adjusting your filters or check back later.
      </p>
      <button
        onClick={onToggle}
        className="rounded-xl bg-[#F87941] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
      >
        Show Tickets
      </button>
    </div>
  );
}

function TicketRowDesktop({ ticket }: { ticket: Ticket }) {
  const overdue = isOverdue(ticket);
  return (
    <tr className="transition hover:bg-slate-50/60">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6">
        {ticket.ticketNo}
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 sm:px-6">
        <div className="font-medium">{ticket.customerName}</div>
        <div className="text-xs text-slate-400">{ticket.device}</div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 sm:px-6">
        <div className="max-w-[200px] truncate" title={ticket.issue}>
          {ticket.issue}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-6">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-6">
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm sm:px-6">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs ${overdue ? "font-semibold text-red-600" : "text-slate-500"}`}
          >
            {formatDate(ticket.dueDate)}
          </span>
          {overdue && (
            <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold uppercase text-red-700">
              Overdue
            </span>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-6">
        <TechnicianPill technician={ticket.assignedTechnician} />
      </td>
    </tr>
  );
}

function TicketCardMobile({ ticket }: { ticket: Ticket }) {
  const overdue = isOverdue(ticket);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-slate-800">
            {ticket.ticketNo}
          </div>
          <div className="text-xs text-slate-500">{ticket.device}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="mb-2 text-sm font-medium text-slate-700">
        {ticket.customerName}
      </div>
      <div className="mb-3 text-sm text-slate-600 line-clamp-2">
        {ticket.issue}
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs ${overdue ? "font-semibold text-red-600" : "text-slate-500"}`}
          >
            Due: {formatDate(ticket.dueDate)}
          </span>
          {overdue && (
            <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold uppercase text-red-700">
              Overdue
            </span>
          )}
        </div>
        <TechnicianPill technician={ticket.assignedTechnician} />
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  const stats = useMemo(() => {
    const total = ticketsData.length;
    const open = ticketsData.filter(
      (t) => t.status !== "delivered" && t.status !== "cancelled"
    ).length;
    const overdue = ticketsData.filter(isOverdue).length;
    const revenue = ticketsData.reduce((s, t) => s + t.estimatedCost, 0);
    return { total, open, overdue, revenue };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F87941] shadow-sm">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                MCTicket
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                Repair Shop Dashboard
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Thursday, May 14, 2026
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEmpty((s) => !s)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 active:bg-slate-100"
              >
                {showEmpty ? "Show Tickets" : "Show Empty State"}
              </button>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F87941] text-xs font-bold text-white shadow-sm">
                  JD
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-700">
                    John Doe
                  </div>
                  <div className="text-xs text-slate-400">Shop Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <StatCard
              label="Total Tickets"
              value={stats.total}
              accent="orange"
            />
            <StatCard label="Open" value={stats.open} accent="blue" />
            <StatCard label="Overdue" value={stats.overdue} accent="red" />
            <StatCard
              label="Revenue"
              value={formatCurrency(stats.revenue)}
              accent="green"
            />
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mb-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#F87941] focus:bg-white focus:ring-2 focus:ring-[#F87941]/20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <select
                  disabled
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-600 outline-none sm:w-40"
                >
                  <option>All Statuses</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="relative">
                <select
                  disabled
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-600 outline-none sm:w-40"
                >
                  <option>All Priorities</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <button className="w-full rounded-xl bg-[#F87941] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95 sm:w-auto">
                Filter
              </button>
            </div>
          </div>
        </section>

        {/* Ticket List */}
        <section>
          {showEmpty ? (
            <EmptyState onToggle={() => setShowEmpty(false)} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 md:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Ticket
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Customer / Device
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Issue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Technician
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ticketsData.map((ticket) => (
                      <TicketRowDesktop key={ticket.id} ticket={ticket} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {ticketsData.map((ticket) => (
                  <TicketCardMobile key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
