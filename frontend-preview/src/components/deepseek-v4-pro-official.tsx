import React, { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────

type TicketStatus =
  | 'new'
  | 'diagnosing'
  | 'waiting_approval'
  | 'repairing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

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

// ── Dummy Data (12 tickets) ────────────────────────────

const TICKETS: Ticket[] = [
  {
    id: '1',
    ticketNo: 'TKT-001',
    customerName: 'John Smith',
    device: 'MacBook Pro 16"',
    issue: 'Liquid damage — won\u2019t power on',
    status: 'diagnosing',
    priority: 'urgent',
    createdAt: new Date('2026-05-12'),
    dueDate: new Date('2026-05-14'),
    assignedTechnician: 'Maria Chen',
    estimatedCost: 850,
  },
  {
    id: '2',
    ticketNo: 'TKT-002',
    customerName: 'Sarah Johnson',
    device: 'iPhone 14',
    issue: 'Cracked front screen, touch unresponsive',
    status: 'new',
    priority: 'high',
    createdAt: new Date('2026-05-14'),
    dueDate: new Date('2026-05-18'),
    assignedTechnician: null,
    estimatedCost: 220,
  },
  {
    id: '3',
    ticketNo: 'TKT-003',
    customerName: 'Mike Williams',
    device: 'Dell XPS 15',
    issue: 'Battery won\u2019t charge, swelling detected',
    status: 'repairing',
    priority: 'normal',
    createdAt: new Date('2026-05-11'),
    dueDate: new Date('2026-05-16'),
    assignedTechnician: 'Alex Turner',
    estimatedCost: 150,
  },
  {
    id: '4',
    ticketNo: 'TKT-004',
    customerName: 'Emily Davis',
    device: 'Samsung Galaxy S24',
    issue: 'Water damage — dropped in pool',
    status: 'waiting_approval',
    priority: 'high',
    createdAt: new Date('2026-05-10'),
    dueDate: new Date('2026-05-13'),
    assignedTechnician: null,
    estimatedCost: 350,
  },
  {
    id: '5',
    ticketNo: 'TKT-005',
    customerName: 'Robert Brown',
    device: 'iPad Air (5th Gen)',
    issue: 'Screen replacement — vertical green line',
    status: 'ready',
    priority: 'normal',
    createdAt: new Date('2026-05-13'),
    dueDate: new Date('2026-05-17'),
    assignedTechnician: 'Maria Chen',
    estimatedCost: 180,
  },
  {
    id: '6',
    ticketNo: 'TKT-006',
    customerName: 'Lisa Anderson',
    device: 'HP Spectre x360',
    issue: 'SSD failure — data recovery needed',
    status: 'repairing',
    priority: 'urgent',
    createdAt: new Date('2026-05-09'),
    dueDate: new Date('2026-05-12'),
    assignedTechnician: 'James Wilson',
    estimatedCost: 600,
  },
  {
    id: '7',
    ticketNo: 'TKT-007',
    customerName: 'Tom Martinez',
    device: 'iMac 24" M3',
    issue: 'Slow performance, fan constantly running',
    status: 'diagnosing',
    priority: 'low',
    createdAt: new Date('2026-05-14'),
    dueDate: new Date('2026-05-20'),
    assignedTechnician: 'Alex Turner',
    estimatedCost: 120,
  },
  {
    id: '8',
    ticketNo: 'TKT-008',
    customerName: 'Jenny Taylor',
    device: 'iPhone 13 Pro',
    issue: 'Back glass shattered — full housing swap',
    status: 'delivered',
    priority: 'normal',
    createdAt: new Date('2026-05-08'),
    dueDate: new Date('2026-05-10'),
    assignedTechnician: 'Maria Chen',
    estimatedCost: 280,
  },
  {
    id: '9',
    ticketNo: 'TKT-009',
    customerName: 'David Lee',
    device: 'Lenovo ThinkPad T14',
    issue: 'Keyboard not registering keystrokes',
    status: 'new',
    priority: 'normal',
    createdAt: new Date('2026-05-15'),
    dueDate: new Date('2026-05-19'),
    assignedTechnician: 'James Wilson',
    estimatedCost: 95,
  },
  {
    id: '10',
    ticketNo: 'TKT-010',
    customerName: 'Karen White',
    device: 'MacBook Air M2',
    issue: 'Trackpad unresponsive, phantom clicks',
    status: 'waiting_approval',
    priority: 'low',
    createdAt: new Date('2026-05-13'),
    dueDate: new Date('2026-05-21'),
    assignedTechnician: 'Alex Turner',
    estimatedCost: 200,
  },
  {
    id: '11',
    ticketNo: 'TKT-011',
    customerName: 'Steve Harris',
    device: 'Google Pixel 8 Pro',
    issue: 'No cellular signal after update',
    status: 'cancelled',
    priority: 'urgent',
    createdAt: new Date('2026-05-07'),
    dueDate: new Date('2026-05-11'),
    assignedTechnician: null,
    estimatedCost: 0,
  },
  {
    id: '12',
    ticketNo: 'TKT-012',
    customerName: 'Rachel Kim',
    device: 'ASUS ROG Zephyrus',
    issue: 'GPU overheating — thermal throttling',
    status: 'repairing',
    priority: 'high',
    createdAt: new Date('2026-05-11'),
    dueDate: new Date('2026-05-14'),
    assignedTechnician: 'James Wilson',
    estimatedCost: 450,
  },
];

// ── Helpers ────────────────────────────────────────────

const TODAY = new Date('2026-05-15');

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const isOverdue = (t: Ticket): boolean =>
  t.dueDate < TODAY && t.status !== 'delivered' && t.status !== 'cancelled';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// ── Status / Priority config ───────────────────────────

const STATUS_COLORS: Record<TicketStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  diagnosing: 'bg-indigo-100 text-indigo-800',
  waiting_approval: 'bg-amber-100 text-amber-800',
  repairing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-100 text-slate-500',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'New',
  diagnosing: 'Diagnosing',
  waiting_approval: 'Awaiting Approval',
  repairing: 'Repairing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  urgent: 'border-red-400 bg-red-50 text-red-700',
  high: 'border-amber-400 bg-amber-50 text-amber-700',
  normal: 'border-sky-400 bg-sky-50 text-sky-700',
  low: 'border-gray-300 bg-gray-50 text-gray-600',
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

// ── Sub-components ─────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function TechnicianDisplay({ name }: { name: string | null }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-gray-300 text-xs text-gray-400">
          ?
        </span>
        Unassigned
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F87941] text-xs font-medium text-white">
        {getInitials(name)}
      </span>
      {name}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  accentClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentClass}`}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 shadow-sm ring-1 ring-gray-100">
      <svg
        className="mb-5 h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700">No tickets found</h3>
      <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or check back later.</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────

export default function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TICKETS.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (q) {
        const searchable = `${t.ticketNo} ${t.customerName} ${t.device} ${t.issue}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const open = filteredTickets.filter(
      (t) => t.status !== 'delivered' && t.status !== 'cancelled'
    ).length;
    const overdue = filteredTickets.filter(isOverdue).length;
    const revenue = filteredTickets.reduce((sum, t) => sum + t.estimatedCost, 0);
    return { total: filteredTickets.length, open, overdue, revenue };
  }, [filteredTickets]);

  const displayDate = TODAY.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── 1. Dashboard Header ─────────────────── */}
        <header className="sticky top-0 z-10 mb-6 flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F87941] text-sm font-bold text-white">
              MC
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MCTicket</h1>
              <p className="text-xs text-gray-400">{displayDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmpty((v) => !v)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
            >
              {showEmpty ? 'Show Tickets' : 'Show Empty State'}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
              JD
            </div>
          </div>
        </header>

        {/* ── 2. Summary Stat Cards ────────────────── */}
        <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Tickets"
            value={String(stats.total)}
            accentClass="bg-blue-50 text-blue-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            label="Open"
            value={String(stats.open)}
            accentClass="bg-orange-50 text-[#F87941]"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Overdue"
            value={String(stats.overdue)}
            accentClass="bg-red-50 text-red-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            }
          />
          <StatCard
            label="Revenue"
            value={formatCurrency(stats.revenue)}
            accentClass="bg-emerald-50 text-emerald-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </section>

        {/* ── 7. Search / Filter UI Mockup ─────────── */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#F87941] focus:ring-1 focus:ring-[#F87941]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#F87941] focus:ring-1 focus:ring-[#F87941]"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#F87941] focus:ring-1 focus:ring-[#F87941]"
          >
            <option value="">All Priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── 3 & 8. Ticket List / Empty State ─────── */}
        {showEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-500">Ticket</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Customer</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Device</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Issue</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Priority</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Due</th>
                    <th className="px-5 py-3 font-medium text-gray-500">Tech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="transition hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-[#F87941]">{t.ticketNo}</td>
                      <td className="px-5 py-3 text-gray-900">{t.customerName}</td>
                      <td className="px-5 py-3 text-gray-600">{t.device}</td>
                      <td className="max-w-[180px] truncate px-5 py-3 text-gray-600" title={t.issue}>{t.issue}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                      <td className={`px-5 py-3 font-mono text-xs ${isOverdue(t) ? 'font-semibold text-red-600' : 'text-gray-500'}`}>
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="px-5 py-3"><TechnicianDisplay name={t.assignedTechnician} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filteredTickets.map((t) => (
                <div key={t.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#F87941]">{t.ticketNo}</span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>

                  <p className="font-medium text-gray-900">{t.customerName}</p>
                  <p className="text-sm text-gray-500">{t.device}</p>
                  <p className="mt-1 text-sm text-gray-600">{t.issue}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                    <span className={`font-mono text-xs ${isOverdue(t) ? 'font-semibold text-red-600' : 'text-gray-500'}`}>
                      Due {formatDate(t.dueDate)}
                    </span>
                    <TechnicianDisplay name={t.assignedTechnician} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
