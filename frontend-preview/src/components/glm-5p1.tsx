import React, { useState } from "react";

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

const tickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Sarah Mitchell",
    device: "MacBook Pro 16\"",
    issue: "Screen flickering after wake from sleep",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2026-05-08"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Mike R.",
    estimatedCost: 180,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "James Park",
    device: "iPhone 14 Pro",
    issue: "Battery draining rapidly, back panel hot",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: "Lisa T.",
    estimatedCost: 95,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Angela Ruiz",
    device: "Dell XPS 15",
    issue: "Laptop won't POST, blinking amber light",
    status: "waiting_approval",
    priority: "normal",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-18"),
    assignedTechnician: "Mike R.",
    estimatedCost: 250,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "David Chen",
    device: "Samsung Galaxy S23",
    issue: "Cracked screen replacement needed",
    status: "new",
    priority: "normal",
    createdAt: new Date("2026-05-13"),
    dueDate: new Date("2026-05-20"),
    assignedTechnician: null,
    estimatedCost: 140,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Maria Lopez",
    device: "iPad Air M1",
    issue: "Touchscreen unresponsive in bottom-left corner",
    status: "ready",
    priority: "low",
    createdAt: new Date("2026-05-06"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: "Lisa T.",
    estimatedCost: 110,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Robert Kim",
    device: "HP Spectre x360",
    issue: "Hinge loose, screen wobbling when open",
    status: "delivered",
    priority: "normal",
    createdAt: new Date("2026-05-01"),
    dueDate: new Date("2026-05-10"),
    assignedTechnician: "Carlos M.",
    estimatedCost: 75,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Emma Watson",
    device: "ThinkPad X1 Carbon",
    issue: "Keyboard keys sticking, trackpad erratic",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2026-05-05"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: null,
    estimatedCost: 0,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Thomas Berg",
    device: "ASUS ROG Strix G16",
    issue: "GPU thermal throttling, fans rattling",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Mike R.",
    estimatedCost: 210,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Priya Sharma",
    device: "MacBook Air M2",
    issue: "USB-C port not charging, tested multiple chargers",
    status: "new",
    priority: "urgent",
    createdAt: new Date("2026-05-14"),
    dueDate: new Date("2026-05-15"),
    assignedTechnician: "Lisa T.",
    estimatedCost: 160,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Lucas Fernandez",
    device: "Surface Pro 9",
    issue: "Windows boot loop after update, blue screen",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-16"),
    assignedTechnician: "Carlos M.",
    estimatedCost: 130,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Nina Okafor",
    device: "Google Pixel 7",
    issue: "Camera lens cracked, rear glass shattered",
    status: "waiting_approval",
    priority: "normal",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-17"),
    assignedTechnician: "Carlos M.",
    estimatedCost: 200,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Oliver Grant",
    device: "Razer Blade 15",
    issue: "Random shutdowns under load, suspect motherboard",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-11"),
    assignedTechnician: "Mike R.",
    estimatedCost: 350,
  },
];

const STATUS_STYLES: Record<TicketStatus, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
  diagnosing: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Diagnosing" },
  waiting_approval: { bg: "bg-amber-100", text: "text-amber-700", label: "Waiting Approval" },
  repairing: { bg: "bg-orange-100", text: "text-orange-700", label: "Repairing" },
  ready: { bg: "bg-green-100", text: "text-green-700", label: "Ready" },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Delivered" },
  cancelled: { bg: "bg-slate-100", text: "text-slate-500", label: "Cancelled" },
};

const PRIORITY_STYLES: Record<TicketPriority, { border: string; text: string; bg: string; label: string }> = {
  urgent: { border: "border-red-400", text: "text-red-700", bg: "bg-red-50", label: "Urgent" },
  high: { border: "border-amber-400", text: "text-amber-700", bg: "bg-amber-50", label: "High" },
  normal: { border: "border-sky-400", text: "text-sky-700", bg: "bg-sky-50", label: "Normal" },
  low: { border: "border-slate-300", text: "text-slate-500", bg: "bg-slate-50", label: "Low" },
};

function StatusBadge({ status }: { status: TicketStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const p = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${p.bg} ${p.text} ${p.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {p.label}
    </span>
  );
}

function TechnicianDisplay({ name }: { name: string | null }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-2 text-slate-400">
        <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-dashed border-slate-300 text-slate-400 text-xs font-medium">
          ?
        </span>
        <span className="text-sm italic">Unassigned</span>
      </span>
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
        {initials}
      </span>
      <span className="text-sm text-slate-700">{name}</span>
    </span>
  );
}

const STAT_ICONS = {
  total: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.062.004-.125.008-.188.013m0 0C8.897 3.987 7.5 5.392 7.5 7.108v12.392a2.25 2.25 0 002.25 2.25h.375" />
    </svg>
  ),
  open: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  overdue: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  revenue: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex items-center gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <svg
        className="w-16 h-16 text-slate-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125h4.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-slate-600 mb-1">No tickets found</h3>
      <p className="text-sm text-slate-400 text-center max-w-xs">
        Try adjusting your filters or check back later.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  const openStatuses: TicketStatus[] = ["new", "diagnosing", "waiting_approval", "repairing", "ready"];
  const today = new Date("2026-05-14");

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => openStatuses.includes(t.status)).length;
  const overdueTickets = tickets.filter(
    (t) => openStatuses.includes(t.status) && t.dueDate < today
  ).length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);

  const displayedTickets = showEmpty ? [] : tickets;

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F87941] text-white font-bold text-sm tracking-tight">
              MC
            </span>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              MCTicket
            </h1>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <span className="text-sm text-slate-500">Thursday, May 14, 2026</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F87941] text-white text-xs font-semibold">
              JD
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Tickets"
            value={totalTickets}
            icon={STAT_ICONS.total}
            accent="bg-orange-50 text-orange-600"
          />
          <StatCard
            label="Open"
            value={openTickets}
            icon={STAT_ICONS.open}
            accent="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Overdue"
            value={overdueTickets}
            icon={STAT_ICONS.overdue}
            accent="bg-red-50 text-red-600"
          />
          <StatCard
            label="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={STAT_ICONS.revenue}
            accent="bg-emerald-50 text-emerald-600"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F87941]/30 focus:border-[#F87941] bg-slate-50"
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#F87941]/30 focus:border-[#F87941]" disabled>
                  <option>Status</option>
                  {Object.values(STATUS_STYLES).map((s) => (
                    <option key={s.label} value={s.label}>{s.label}</option>
                  ))}
                </select>
                <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#F87941]/30 focus:border-[#F87941]" disabled>
                  <option>Priority</option>
                  {Object.values(PRIORITY_STYLES).map((p) => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#F87941] text-white text-sm font-medium hover:bg-[#e86a34] transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmpty((prev) => !prev)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                {showEmpty ? "Show Tickets" : "Show Empty State"}
              </button>
            </div>
          </div>

          {displayedTickets.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ticket</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Customer</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Device</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Issue</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Priority</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Technician</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-slate-50 hover:bg-orange-50/30 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-semibold text-[#F87941]">{ticket.ticketNo}</td>
                        <td className="px-5 py-3.5 text-slate-700">{ticket.customerName}</td>
                        <td className="px-5 py-3.5 text-slate-600">{ticket.device}</td>
                        <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{ticket.issue}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={ticket.status} /></td>
                        <td className="px-5 py-3.5"><PriorityBadge priority={ticket.priority} /></td>
                        <td className="px-5 py-3.5"><TechnicianDisplay name={ticket.assignedTechnician} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-slate-100">
                {displayedTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F87941]">{ticket.ticketNo}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{ticket.customerName}</p>
                      <p className="text-sm text-slate-500">{ticket.device}</p>
                      <p className="text-sm text-slate-600">{ticket.issue}</p>
                    </div>
                    <TechnicianDisplay name={ticket.assignedTechnician} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
