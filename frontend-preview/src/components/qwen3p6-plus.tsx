import { useState } from "react";

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

const tickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Marcus Chen",
    device: "MacBook Pro 16\" M3",
    issue: "Logic board repair — randomly shutting down",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 450.00,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Sarah Nguyen",
    device: "iPhone 15 Pro Max",
    issue: "Cracked back glass and camera replacement",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-15"),
    assignedTechnician: "Jordan Lee",
    estimatedCost: 320.00,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "David Okonkwo",
    device: "Dell XPS 15",
    issue: "SSD upgrade and OS reinstall",
    status: "new",
    priority: "normal",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-19"),
    assignedTechnician: "Maria Santos",
    estimatedCost: 180.00,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Emily Zhang",
    device: "Samsung Galaxy S24 Ultra",
    issue: "Water damage — phone won't power on",
    status: "diagnosing",
    priority: "urgent",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: null,
    estimatedCost: 275.00,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Tom Andersen",
    device: "HP Pavilion Gaming Laptop",
    issue: "GPU artifacts during gaming",
    status: "ready",
    priority: "normal",
    createdAt: new Date("2026-05-08"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 350.00,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Priya Patel",
    device: "Lenovo ThinkPad T14",
    issue: "Keyboard replacement — several keys not registering",
    status: "delivered",
    priority: "low",
    createdAt: new Date("2026-05-05"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: "Jordan Lee",
    estimatedCost: 120.00,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Jake Morrison",
    device: "iPad Air M2",
    issue: "Touch screen digitizer unresponsive",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-16"),
    assignedTechnician: "Maria Santos",
    estimatedCost: 260.00,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Lisa Fernandez",
    device: "ASUS ROG Strix G16",
    issue: "Thermal paste replacement and fan cleaning",
    status: "new",
    priority: "low",
    createdAt: new Date("2026-05-13"),
    dueDate: new Date("2026-05-22"),
    assignedTechnician: null,
    estimatedCost: 95.00,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Carlos Jimenez",
    device: "Surface Pro 9",
    issue: "Battery swelling — device warping",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 210.00,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Aisha Williams",
    device: "MacBook Air M2",
    issue: "Screen flickering — possible display cable issue",
    status: "diagnosing",
    priority: "normal",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-17"),
    assignedTechnician: "Jordan Lee",
    estimatedCost: 175.00,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Ben Harper",
    device: "Alienware m18 R2",
    issue: "Motherboard replacement after power surge",
    status: "cancelled",
    priority: "high",
    createdAt: new Date("2026-05-07"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: "Maria Santos",
    estimatedCost: 680.00,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Nina Kowalski",
    device: "iPhone 14",
    issue: "Charging port replacement — won't charge",
    status: "ready",
    priority: "normal",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 85.00,
  },
];

const statusConfig: Record<TicketStatus, { label: string; bg: string; text: string }> = {
  new: { label: "New", bg: "bg-blue-100", text: "text-blue-700" },
  diagnosing: { label: "Diagnosing", bg: "bg-indigo-100", text: "text-indigo-700" },
  waiting_approval: { label: "Waiting Approval", bg: "bg-amber-100", text: "text-amber-700" },
  repairing: { label: "Repairing", bg: "bg-orange-100", text: "text-orange-700" },
  ready: { label: "Ready", bg: "bg-green-100", text: "text-green-700" },
  delivered: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled: { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-600" },
};

const priorityConfig: Record<TicketPriority, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: "Urgent", bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  high: { label: "High", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  normal: { label: "Normal", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-300" },
  low: { label: "Low", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-300" },
};

function isOverdue(ticket: Ticket): boolean {
  if (ticket.status === "delivered" || ticket.status === "cancelled") return false;
  const now = new Date("2026-05-14");
  return ticket.dueDate < now;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {priority === "urgent" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13H9v-2h2v2zm0-4H9V6h2v3z" clipRule="evenodd" />
        </svg>
      )}
      {config.label}
    </span>
  );
}

function TechnicianAvatar({ name }: { name: string | null }) {
  if (!name) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <span className="text-gray-400 text-xs font-bold">?</span>
        </div>
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      </div>
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
        <span className="text-xs font-bold text-orange-700">{initials}</span>
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No tickets found</h3>
      <p className="text-sm text-gray-400">Try adjusting your filters or check back later.</p>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const overdue = isOverdue(ticket);
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-4 ${overdue ? "border-red-200" : "border-gray-100"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-sm font-semibold text-gray-900">{ticket.ticketNo}</span>
          {overdue && (
            <span className="ml-2 text-xs text-red-500 font-medium flex items-center inline-flex">
              <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Overdue
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-800">{ticket.customerName}</p>
        <p className="text-sm text-gray-500">{ticket.device}</p>
        <p className="text-xs text-gray-400 mt-1">{ticket.issue}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <TechnicianAvatar name={ticket.assignedTechnician} />
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(ticket.estimatedCost)}</p>
          <p className="text-xs text-gray-400">Due {formatDate(ticket.dueDate)}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status !== "delivered" && t.status !== "cancelled").length;
  const overdueTickets = tickets.filter((t) => isOverdue(t)).length;
  const totalRevenue = tickets.reduce((sum, t) => {
    if (t.status !== "cancelled") return sum + t.estimatedCost;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  MCTicket
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Repair Shop Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 hidden md:block">Thursday, May 14, 2026</p>
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                <span className="text-sm font-semibold text-orange-600">JS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalTickets}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Open</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{openTickets}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Overdue</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{overdueTickets}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-medium text-emerald-500 uppercase tracking-wide">Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        {/* Search / Filter UI Mockup */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 bg-gray-50"
              />
            </div>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300">
              <option>All Statuses</option>
              {Object.keys(statusConfig).map((s) => (
                <option key={s}>{statusConfig[s as TicketStatus].label}</option>
              ))}
            </select>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300">
              <option>All Priorities</option>
              {Object.keys(priorityConfig).map((p) => (
                <option key={p}>{priorityConfig[p as TicketPriority].label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowEmpty(!showEmpty)}
              className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
            >
              {showEmpty ? "Show Tickets" : "Show Empty State"}
            </button>
          </div>
        </div>

        {/* Ticket List / Table */}
        {showEmpty ? (
          <EmptyState />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-orange-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ticket</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Device</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Issue</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Priority</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Technician</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => {
                    const overdue = isOverdue(ticket);
                    return (
                      <tr
                        key={ticket.id}
                        className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${overdue ? "bg-red-50/30" : index % 2 === 0 ? "bg-gray-50/30" : ""}`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            {ticket.ticketNo}
                            {overdue && (
                              <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{ticket.customerName}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{ticket.device}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{ticket.issue}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <TechnicianAvatar name={ticket.assignedTechnician} />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatCurrency(ticket.estimatedCost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
