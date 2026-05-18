import React, { useState } from 'react';

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
    customerName: "Sarah Mitchell",
    device: "MacBook Pro 14\"",
    issue: "Screen flickering after water spill",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-15"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 450,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "James Wilson",
    device: "iPhone 14 Pro",
    issue: "Battery draining rapidly, needs replacement",
    status: "waiting_approval",
    priority: "normal",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Lisa Park",
    estimatedCost: 89,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Emma Rodriguez",
    device: "Dell XPS 15",
    issue: "Laptop won't boot, blue screen error",
    status: "diagnosing",
    priority: "urgent",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: null,
    estimatedCost: 320,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "David Kim",
    device: "Samsung Galaxy S23",
    issue: "Cracked screen replacement needed",
    status: "ready",
    priority: "high",
    createdAt: new Date("2026-05-08"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 275,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Anna Thompson",
    device: "iPad Air 5th Gen",
    issue: "Charging port not working, loose connection",
    status: "new",
    priority: "low",
    createdAt: new Date("2026-05-14"),
    dueDate: new Date("2026-05-20"),
    assignedTechnician: null,
    estimatedCost: 120,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Robert Garcia",
    device: "HP Spectre x360",
    issue: "Keyboard keys sticking, multiple keys unresponsive",
    status: "delivered",
    priority: "normal",
    createdAt: new Date("2026-05-05"),
    dueDate: new Date("2026-05-11"),
    assignedTechnician: "Lisa Park",
    estimatedCost: 180,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Jennifer Lee",
    device: "MacBook Air M2",
    issue: "Trackpad not responding to clicks",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 200,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Michael Brown",
    device: "Google Pixel 7",
    issue: "Microphone not working during calls",
    status: "repairing",
    priority: "normal",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: "Lisa Park",
    estimatedCost: 95,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Emily Davis",
    device: "Surface Pro 9",
    issue: "Overheating and random shutdowns",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-16"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 380,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Christopher Martinez",
    device: "iPhone 13",
    issue: "Face ID not working after screen replacement",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date("2026-05-13"),
    dueDate: new Date("2026-05-15"),
    assignedTechnician: "Lisa Park",
    estimatedCost: 150,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Amanda White",
    device: "Asus ROG Strix",
    issue: "GPU overheating, thermal paste replacement",
    status: "new",
    priority: "high",
    createdAt: new Date("2026-05-14"),
    dueDate: new Date("2026-05-18"),
    assignedTechnician: null,
    estimatedCost: 210,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Daniel Taylor",
    device: "MacBook Pro 16\"",
    issue: "SSD upgrade and data migration",
    status: "ready",
    priority: "normal",
    createdAt: new Date("2026-05-07"),
    dueDate: new Date("2026-05-10"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 550,
  },
];

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const statusConfig: Record<TicketStatus, { bg: string; text: string }> = {
    new: { bg: "bg-blue-100", text: "text-blue-700" },
    diagnosing: { bg: "bg-indigo-100", text: "text-indigo-700" },
    waiting_approval: { bg: "bg-amber-100", text: "text-amber-700" },
    repairing: { bg: "bg-orange-100", text: "text-orange-700" },
    ready: { bg: "bg-green-100", text: "text-green-700" },
    delivered: { bg: "bg-emerald-100", text: "text-emerald-700" },
    cancelled: { bg: "bg-slate-100", text: "text-slate-600" },
  };

  const config = statusConfig[status];
  const label = status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  const priorityConfig: Record<TicketPriority, { border: string; text: string; bg: string }> = {
    urgent: { border: "border-red-400", text: "text-red-700", bg: "bg-red-50" },
    high: { border: "border-orange-400", text: "text-orange-700", bg: "bg-orange-50" },
    normal: { border: "border-sky-400", text: "text-sky-700", bg: "bg-sky-50" },
    low: { border: "border-slate-300", text: "text-slate-600", bg: "bg-slate-50" },
  };

  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}>
      {priority.toUpperCase()}
    </span>
  );
};

const TechnicianDisplay: React.FC<{ name: string | null }> = ({ name }) => {
  if (!name) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
          <span className="text-slate-400 text-sm">?</span>
        </div>
        <span className="text-slate-400 text-sm italic">Unassigned</span>
      </div>
    );
  }

  const initials = name.split(" ").map(n => n[0]).join("");

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: "#F87941" }}>
        {initials}
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; accentColor: string }> = ({ label, value, icon, accentColor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${accentColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const TicketRow: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4">
        <span className="font-semibold text-gray-800">{ticket.ticketNo}</span>
      </td>
      <td className="py-4 px-4 text-gray-700">{ticket.customerName}</td>
      <td className="py-4 px-4 text-gray-600 text-sm">{ticket.device}</td>
      <td className="py-4 px-4 text-gray-600 text-sm max-w-xs truncate">{ticket.issue}</td>
      <td className="py-4 px-4"><StatusBadge status={ticket.status} /></td>
      <td className="py-4 px-4"><PriorityBadge priority={ticket.priority} /></td>
      <td className="py-4 px-4"><TechnicianDisplay name={ticket.assignedTechnician} /></td>
    </tr>
  );
};

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-gray-800">{ticket.ticketNo}</span>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Customer:</span>
          <span className="text-gray-700 font-medium">{ticket.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Device:</span>
          <span className="text-gray-700">{ticket.device}</span>
        </div>
        <div className="text-gray-600">{ticket.issue}</div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <StatusBadge status={ticket.status} />
          <TechnicianDisplay name={ticket.assignedTechnician} />
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No tickets found</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">Try adjusting your filters or check back later.</p>
    </div>
  );
};

export default function Dashboard() {
  const [showEmptyState, setShowEmptyState] = useState(false);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => !["delivered", "cancelled"].includes(t.status)).length;
  const today = new Date("2026-05-14");
  const overdueTickets = tickets.filter(t => t.dueDate < today && !["delivered", "cancelled"].includes(t.status)).length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F87941" }}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">MCTicket</h1>
            </div>
            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
              <p className="text-sm text-gray-500">Thursday, May 14, 2026</p>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: "#F87941" }}>
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Total Tickets"
            value={totalTickets}
            accentColor="bg-blue-100 text-blue-600"
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Open"
            value={openTickets}
            accentColor="bg-green-100 text-green-600"
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Overdue"
            value={overdueTickets}
            accentColor="bg-red-100 text-red-600"
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard
            label="Revenue"
            value={formatCurrency(totalRevenue)}
            accentColor="bg-orange-100 text-orange-600"
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option>All Status</option>
                  <option>New</option>
                  <option>Diagnosing</option>
                  <option>Waiting Approval</option>
                  <option>Repairing</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option>All Priority</option>
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Normal</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmptyState(!showEmptyState)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {showEmptyState ? "Show Tickets" : "Show Empty State"}
              </button>
              <button className="px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: "#F87941" }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {showEmptyState ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <TicketRow key={ticket.id} ticket={ticket} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-3">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
