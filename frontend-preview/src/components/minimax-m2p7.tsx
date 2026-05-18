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

const statusColors: Record<TicketStatus, { bg: string; text: string }> = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700' },
  diagnosing: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  waiting_approval: { bg: 'bg-amber-100', text: 'text-amber-700' },
  repairing: { bg: 'bg-orange-100', text: 'text-orange-700' },
  ready: { bg: 'bg-green-100', text: 'text-green-700' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cancelled: { bg: 'bg-slate-100', text: 'text-slate-500' },
};

const priorityColors: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  normal: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300' },
  low: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-300' },
};

const statusLabels: Record<TicketStatus, string> = {
  new: 'New',
  diagnosing: 'Diagnosing',
  waiting_approval: 'Awaiting Approval',
  repairing: 'Repairing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const priorityLabels: Record<TicketPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

const tickets: Ticket[] = [
  { id: '1', ticketNo: 'TKT-001', customerName: 'Sarah Mitchell', device: 'MacBook Pro 16"', issue: 'Screen flickering and keyboard not responding', status: 'diagnosing', priority: 'high', createdAt: new Date('2026-05-10'), dueDate: new Date('2026-05-15'), assignedTechnician: 'Mike Chen', estimatedCost: 450 },
  { id: '2', ticketNo: 'TKT-002', customerName: 'James Rodriguez', device: 'iPhone 14 Pro', issue: 'Water damage after screen replacement', status: 'waiting_approval', priority: 'urgent', createdAt: new Date('2026-05-11'), dueDate: new Date('2026-05-13'), assignedTechnician: 'Lisa Park', estimatedCost: 280 },
  { id: '3', ticketNo: 'TKT-003', customerName: 'Emily Watson', device: 'Dell XPS 15', issue: 'Battery not charging, trackpad issues', status: 'repairing', priority: 'normal', createdAt: new Date('2026-05-09'), dueDate: new Date('2026-05-16'), assignedTechnician: 'Mike Chen', estimatedCost: 320 },
  { id: '4', ticketNo: 'TKT-004', customerName: 'Robert Kim', device: 'Samsung Galaxy S24', issue: 'Speaker not working after update', status: 'new', priority: 'low', createdAt: new Date('2026-05-13'), dueDate: new Date('2026-05-19'), assignedTechnician: null, estimatedCost: 95 },
  { id: '5', ticketNo: 'TKT-005', customerName: 'Amanda Foster', device: 'iMac 27"', issue: 'Startup failure, no chime sound', status: 'ready', priority: 'high', createdAt: new Date('2026-05-08'), dueDate: new Date('2026-05-14'), assignedTechnician: 'David Lee', estimatedCost: 680 },
  { id: '6', ticketNo: 'TKT-006', customerName: 'Michael Brown', device: 'ASUS ROG Laptop', issue: ' overheating during gaming sessions', status: 'delivered', priority: 'normal', createdAt: new Date('2026-05-05'), dueDate: new Date('2026-05-12'), assignedTechnician: 'Lisa Park', estimatedCost: 520 },
  { id: '7', ticketNo: 'TKT-007', customerName: 'Jennifer Walsh', device: 'MacBook Air M2', issue: 'Keyboard replacement needed', status: 'cancelled', priority: 'low', createdAt: new Date('2026-05-07'), dueDate: new Date('2026-05-14'), assignedTechnician: null, estimatedCost: 150 },
  { id: '8', ticketNo: 'TKT-008', customerName: 'Thomas Garcia', device: 'Lenovo ThinkPad X1', issue: 'USB ports not recognizing devices', status: 'diagnosing', priority: 'normal', createdAt: new Date('2026-05-12'), dueDate: new Date('2026-05-17'), assignedTechnician: 'David Lee', estimatedCost: 180 },
  { id: '9', ticketNo: 'TKT-009', customerName: 'Rachel Thompson', device: 'iPad Pro 12.9"', issue: 'Cracked screen from accidental drop', status: 'waiting_approval', priority: 'high', createdAt: new Date('2026-05-11'), dueDate: new Date('2026-05-14'), assignedTechnician: 'Mike Chen', estimatedCost: 350 },
  { id: '10', ticketNo: 'TKT-010', customerName: 'Daniel Martinez', device: 'HP Spectre x360', issue: 'Touchscreen unresponsive in lower half', status: 'repairing', priority: 'urgent', createdAt: new Date('2026-05-10'), dueDate: new Date('2026-05-13'), assignedTechnician: 'Lisa Park', estimatedCost: 420 },
  { id: '11', ticketNo: 'TKT-011', customerName: 'Nicole Adams', device: 'Google Pixel 8', issue: 'Camera app crashes on launch', status: 'new', priority: 'normal', createdAt: new Date('2026-05-13'), dueDate: new Date('2026-05-18'), assignedTechnician: 'David Lee', estimatedCost: 110 },
  { id: '12', ticketNo: 'TKT-012', customerName: 'Christopher Lee', device: 'Surface Pro 9', issue: 'Pen not detected after screen replacement', status: 'diagnosing', priority: 'high', createdAt: new Date('2026-05-12'), dueDate: new Date('2026-05-15'), assignedTechnician: 'Mike Chen', estimatedCost: 290 },
];

function StatusBadge({ status }: { status: TicketStatus }) {
  const colors = statusColors[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {statusLabels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const colors = priorityColors[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
      {priorityLabels[priority]}
    </span>
  );
}

function TechnicianAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
        <span className="text-xs font-semibold text-orange-600">{initials}</span>
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
}

function UnassignedBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-400">?</span>
      </div>
      <span className="text-sm text-gray-400 italic">Unassigned</span>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-gray-900">{ticket.ticketNo}</span>
            <span className="text-gray-400">|</span>
            <span className="font-medium text-gray-800">{ticket.customerName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="bg-gray-50 px-2 py-1 rounded-md">{ticket.device}</span>
            <span className="max-w-xs truncate">{ticket.issue}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          {ticket.assignedTechnician ? (
            <TechnicianAvatar name={ticket.assignedTechnician} />
          ) : (
            <UnassignedBadge />
          )}
          <span className="text-sm font-semibold text-gray-700 ml-2">
            ${ticket.estimatedCost}
          </span>
        </div>
      </div>
    </div>
  );
}

function TableRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
      <td className="py-3 px-4 font-semibold text-gray-900">{ticket.ticketNo}</td>
      <td className="py-3 px-4">
        <div className="font-medium text-gray-800">{ticket.customerName}</div>
        <div className="text-sm text-gray-500">{ticket.device}</div>
      </td>
      <td className="py-3 px-4 max-w-xs truncate text-gray-600">{ticket.issue}</td>
      <td className="py-3 px-4"><StatusBadge status={ticket.status} /></td>
      <td className="py-3 px-4"><PriorityBadge priority={ticket.priority} /></td>
      <td className="py-3 px-4">
        {ticket.assignedTechnician ? (
          <TechnicianAvatar name={ticket.assignedTechnician} />
        ) : (
          <UnassignedBadge />
        )}
      </td>
      <td className="py-3 px-4 font-semibold text-gray-700">${ticket.estimatedCost}</td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
      <p className="text-gray-500 text-center max-w-sm">Try adjusting your filters or check back later for new tickets.</p>
    </div>
  );
}

export default function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => !['delivered', 'cancelled'].includes(t.status)).length;
  const overdueTickets = tickets.filter(t => t.dueDate < new Date() && !['delivered', 'cancelled'].includes(t.status)).length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MCTicket</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Computer Repair Shop Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Thursday, May 14, 2026</span>
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-600">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Tickets"
              value={totalTickets.toString()}
              accent="bg-orange-100"
              icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
            />
            <StatCard
              label="Open"
              value={openTickets.toString()}
              accent="bg-blue-100"
              icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Overdue"
              value={overdueTickets.toString()}
              accent="bg-red-100"
              icon={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
            <StatCard
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              accent="bg-green-100"
              icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>
        </section>

        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                <option value="">All Statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                <option value="">All Priorities</option>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                Filter
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{showEmpty ? 0 : totalTickets} tickets</p>
              <button
                onClick={() => setShowEmpty(!showEmpty)}
                className="px-4 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                {showEmpty ? 'Show Tickets' : 'Show Empty State'}
              </button>
            </div>
          </div>
        </section>

        <section>
          {showEmpty ? (
            <EmptyState />
          ) : (
            <>
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Issue</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Technician</th>
                      <th className="py-3 px-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <TableRow key={ticket.id} ticket={ticket} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-3">
                {tickets.map(ticket => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}