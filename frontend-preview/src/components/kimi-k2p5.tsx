import React, { useState, useMemo } from 'react';

// ============================================================================
// TypeScript Types
// ============================================================================

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

// ============================================================================
// Static Dummy Data - 12 Tickets
// ============================================================================

const DUMMY_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Sarah Johnson",
    device: "MacBook Pro 16\"",
    issue: "Screen flickering and random shutdowns",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2026-05-10"),
    dueDate: new Date("2026-05-15"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 450.00,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "David Martinez",
    device: "iPhone 14 Pro",
    issue: "Cracked screen, touch not responding",
    status: "new",
    priority: "urgent",
    createdAt: new Date("2026-05-14"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: null,
    estimatedCost: 299.99,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Jennifer Walsh",
    device: "Dell XPS 13",
    issue: "Battery not holding charge",
    status: "diagnosing",
    priority: "normal",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-18"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 180.00,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Robert Kim",
    device: "Samsung Galaxy S23",
    issue: "Water damage, won't power on",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date("2026-05-08"),
    dueDate: new Date("2026-05-12"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 350.00,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Emily Chen",
    device: "iPad Air 5",
    issue: "Broken charging port",
    status: "ready",
    priority: "normal",
    createdAt: new Date("2026-05-11"),
    dueDate: new Date("2026-05-16"),
    assignedTechnician: "Sarah Williams",
    estimatedCost: 125.00,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "James Thompson",
    device: "HP Spectre x360",
    issue: "Keyboard keys sticking",
    status: "delivered",
    priority: "low",
    createdAt: new Date("2026-05-05"),
    dueDate: new Date("2026-05-10"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 95.00,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Lisa Anderson",
    device: "MacBook Air M2",
    issue: "Liquid spill, logic board repair",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2026-05-13"),
    dueDate: new Date("2026-05-20"),
    assignedTechnician: null,
    estimatedCost: 650.00,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Michael Brown",
    device: "Google Pixel 8",
    issue: "Camera not focusing",
    status: "new",
    priority: "normal",
    createdAt: new Date("2026-05-14"),
    dueDate: new Date("2026-05-21"),
    assignedTechnician: "Sarah Williams",
    estimatedCost: 150.00,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Amanda Davis",
    device: "Lenovo ThinkPad X1",
    issue: "Slow performance, SSD upgrade",
    status: "waiting_approval",
    priority: "low",
    createdAt: new Date("2026-05-09"),
    dueDate: new Date("2026-05-19"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 275.00,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Chris Wilson",
    device: "iPhone 13",
    issue: "Back glass cracked",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2026-05-06"),
    dueDate: new Date("2026-05-13"),
    assignedTechnician: null,
    estimatedCost: 199.99,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Michelle Lee",
    device: "Surface Pro 9",
    issue: "Pen not working, display issues",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2026-05-13"),
    dueDate: new Date("2026-05-17"),
    assignedTechnician: "Alex Rivera",
    estimatedCost: 320.00,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Daniel Garcia",
    device: "Asus ROG Gaming Laptop",
    issue: "Overheating, fan replacement",
    status: "ready",
    priority: "urgent",
    createdAt: new Date("2026-05-12"),
    dueDate: new Date("2026-05-14"),
    assignedTechnician: "Sarah Williams",
    estimatedCost: 210.00,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const isOverdue = (dueDate: Date, status: TicketStatus): boolean => {
  const today = new Date("2026-05-14");
  return dueDate < today && status !== 'delivered' && status !== 'cancelled';
};

// ============================================================================
// Sub-Components
// ============================================================================

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const styles: Record<TicketStatus, string> = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    diagnosing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    waiting_approval: 'bg-amber-100 text-amber-700 border-amber-200',
    repairing: 'bg-orange-100 text-orange-700 border-orange-200',
    ready: 'bg-green-100 text-green-700 border-green-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const labels: Record<TicketStatus, string> = {
    new: 'New',
    diagnosing: 'Diagnosing',
    waiting_approval: 'Waiting Approval',
    repairing: 'Repairing',
    ready: 'Ready',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  const styles: Record<TicketPriority, string> = {
    urgent: 'bg-red-50 text-red-600 border-red-200 border-dashed',
    high: 'bg-orange-50 text-orange-600 border-orange-200',
    normal: 'bg-sky-50 text-sky-600 border-sky-200',
    low: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  const labels: Record<TicketPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

const TechnicianAvatar: React.FC<{ technician: string | null }> = ({ technician }) => {
  if (!technician) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
          <span className="text-xs">?</span>
        </div>
        <span className="text-sm">Unassigned</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F87941] to-[#E56A33] flex items-center justify-center text-white text-xs font-medium">
        {getInitials(technician)}
      </div>
      <span className="text-sm text-slate-700">{technician}</span>
    </div>
  );
};

const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  icon: React.ReactNode;
  accentColor?: string;
}> = ({ label, value, icon, accentColor = 'bg-[#F87941]' }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${accentColor} bg-opacity-10 flex items-center justify-center text-[#F87941]`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onShowTickets: () => void }> = ({ onShowTickets }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">No tickets found</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
        Try adjusting your filters or check back later.
      </p>
      <button
        onClick={onShowTickets}
        className="px-4 py-2 bg-[#F87941] text-white rounded-lg text-sm font-medium hover:bg-[#E56A33] transition-colors"
      >
        Show Tickets
      </button>
    </div>
  );
};

const TicketCardMobile: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const overdue = isOverdue(ticket.dueDate, ticket.status);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{ticket.ticketNo}</p>
          <p className="text-sm text-slate-600">{ticket.customerName}</p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">{ticket.device}</p>
        <p className="text-xs text-slate-500 line-clamp-2">{ticket.issue}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <PriorityBadge priority={ticket.priority} />
        <div className="text-right">
          <p className="text-xs text-slate-400">Due</p>
          <p className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-slate-600'}`}>
            {formatDate(ticket.dueDate)}
            {overdue && ' (Overdue)'}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <TechnicianAvatar technician={ticket.assignedTechnician} />
      </div>
    </div>
  );
};

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function Dashboard() {
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = DUMMY_TICKETS.length;
    const open = DUMMY_TICKETS.filter(t => 
      t.status !== 'delivered' && t.status !== 'cancelled'
    ).length;
    const overdue = DUMMY_TICKETS.filter(t => 
      isOverdue(t.dueDate, t.status)
    ).length;
    const revenue = DUMMY_TICKETS.reduce((sum, t) => sum + t.estimatedCost, 0);

    return { total, open, overdue, revenue };
  }, []);

  const today = "Thursday, May 14, 2026";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==========================================================================
          Section 1: Dashboard Header
          ========================================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F87941] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">MCTicket</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Repair Shop Management</p>
              </div>
            </div>

            {/* Date & User */}
            <div className="flex items-center gap-4 sm:gap-6">
              <p className="text-sm text-slate-600 hidden md:block">{today}</p>
              
              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">Shop Manager</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-medium">
                  SM
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ==========================================================================
            Section 2: Summary Stat Cards
            ========================================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tickets"
            value={stats.total}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Open"
            value={stats.open}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            accentColor="bg-blue-50"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            accentColor="bg-red-50"
          />
          <StatCard
            label="Revenue"
            value={formatCurrency(stats.revenue)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            accentColor="bg-emerald-50"
          />
        </section>

        {/* ==========================================================================
            Section 7: Search / Filter UI Mockup
            ========================================================================== */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F87941] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F87941]">
                <option>All Statuses</option>
                <option>New</option>
                <option>Diagnosing</option>
                <option>Waiting Approval</option>
                <option>Repairing</option>
                <option>Ready</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F87941]">
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </select>

              <button className="px-6 py-2.5 bg-[#F87941] text-white rounded-xl text-sm font-medium hover:bg-[#E56A33] transition-colors">
                Filter
              </button>
            </div>

            {/* Empty State Toggle */}
            <div className="lg:pl-4 lg:border-l border-slate-200">
              <button
                onClick={() => setShowEmptyState(!showEmptyState)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  showEmptyState 
                    ? 'bg-slate-100 text-slate-700 border-slate-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {showEmptyState ? 'Show Tickets' : 'Show Empty State'}
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            Section 3 & 8: Ticket List / Empty State
            ========================================================================== */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {showEmptyState ? (
            <EmptyState onShowTickets={() => setShowEmptyState(false)} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Customer / Device
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Issue
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Assigned
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DUMMY_TICKETS.map((ticket) => {
                      const overdue = isOverdue(ticket.dueDate, ticket.status);
                      return (
                        <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-[#F87941]">{ticket.ticketNo}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{ticket.customerName}</p>
                              <p className="text-xs text-slate-500">{ticket.device}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600 max-w-xs truncate">{ticket.issue}</p>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={ticket.status} />
                          </td>
                          <td className="px-6 py-4">
                            <PriorityBadge priority={ticket.priority} />
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                              {formatDate(ticket.dueDate)}
                              {overdue && (
                                <span className="ml-1 text-xs">(Overdue)</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <TechnicianAvatar technician={ticket.assignedTechnician} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-medium text-slate-700">
                              {formatCurrency(ticket.estimatedCost)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {DUMMY_TICKETS.map((ticket) => (
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
