export type Status =
  | "new"
  | "diagnosing"
  | "waiting_approval"
  | "repairing"
  | "ready"
  | "delivered"
  | "cancelled";

export type Priority = "low" | "normal" | "high" | "urgent";

export interface Ticket {
  id: string;
  ticketNo: string;
  customerName: string;
  device: string;
  issue: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  dueDate: Date;
  assignedTechnician: string | null;
  estimatedCost: number;
  paidAmount: number;
}

export interface TicketSummary {
  totalTickets: number;
  totalRevenue: number;
  totalPaid: number;
  outstandingAmount: number;
  averageTicketValue: number;
  completionRate: number;
  statusCounts: Record<Status, number>;
}

export interface UrgentQueue {
  overdue: Ticket[];
  slaRisk: Ticket[];
  highPriorityOpen: Ticket[];
}

const STATUSES: Status[] = [
  "new",
  "diagnosing",
  "waiting_approval",
  "repairing",
  "ready",
  "delivered",
  "cancelled",
];

const PRIORITIES: Priority[] = ["low", "normal", "high", "urgent"];

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const TERMINAL_STATUSES = new Set<Status>(["delivered", "cancelled", "ready"]);

function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const dateDiff = a.dueDate.getTime() - b.dueDate.getTime();
    if (dateDiff !== 0) return dateDiff;
    return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
  });
}

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((acc, t) => acc + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((acc, t) => acc + t.paidAmount, 0);

  const statusCounts = {} as Record<Status, number>;
  for (const s of STATUSES) {
    statusCounts[s] = 0;
  }
  for (const t of tickets) {
    statusCounts[t.status]++;
  }

  const deliveredCount = statusCounts["delivered"];
  const completionRate =
    totalTickets === 0
      ? 0
      : Math.round((deliveredCount / totalTickets) * 1000) / 10;

  return {
    totalTickets,
    totalRevenue,
    totalPaid,
    outstandingAmount: totalRevenue - totalPaid,
    averageTicketValue: totalTickets === 0 ? 0 : totalRevenue / totalTickets,
    completionRate,
    statusCounts,
  };
}

export function groupByStatus(tickets: Ticket[]): Record<Status, Ticket[]> {
  const groups = {} as Record<Status, Ticket[]>;
  for (const s of STATUSES) {
    groups[s] = [];
  }
  for (const t of tickets) {
    groups[t.status].push(t);
  }
  return groups;
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const groups = {} as Record<Priority, Ticket[]>;
  for (const p of PRIORITIES) {
    groups[p] = [];
  }
  for (const t of tickets) {
    groups[t.priority].push(t);
  }
  return groups;
}

export function getOverdueTickets(
  tickets: Ticket[],
  now: Date = new Date()
): Ticket[] {
  const nowMs = now.getTime();
  const overdue = tickets.filter(
    (t) => t.dueDate.getTime() < nowMs && !TERMINAL_STATUSES.has(t.status)
  );
  return sortTickets(overdue);
}

export function getSLARiskTickets(
  tickets: Ticket[],
  now: Date = new Date(),
  hoursThreshold = 24
): Ticket[] {
  const nowMs = now.getTime();
  const windowMs = hoursThreshold * 3_600_000;
  const atRisk = tickets.filter((t) => {
    if (TERMINAL_STATUSES.has(t.status)) return false;
    const dueMs = t.dueDate.getTime();
    return dueMs >= nowMs && dueMs <= nowMs + windowMs;
  });
  return sortTickets(atRisk);
}

export function getUrgentQueue(
  tickets: Ticket[],
  now: Date = new Date()
): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const slaRisk = getSLARiskTickets(tickets, now);

  const accounted = new Set(overdue.map((t) => t.id));
  for (const t of slaRisk) accounted.add(t.id);

  const highPriorityOpen = tickets.filter(
    (t) =>
      !TERMINAL_STATUSES.has(t.status) &&
      (t.priority === "high" || t.priority === "urgent") &&
      !accounted.has(t.id)
  );

  return {
    overdue,
    slaRisk,
    highPriorityOpen: sortTickets(highPriorityOpen),
  };
}

function hoursFromNow(h: number): Date {
  return new Date(Date.now() + h * 3_600_000);
}

export const dummyTickets: Ticket[] = [
  {
    id: "a1",
    ticketNo: "TKT-001",
    customerName: "Mia Chen",
    device: "MacBook Pro 2023",
    issue: "Display horizontal lines",
    status: "repairing",
    priority: "high",
    createdAt: hoursFromNow(-96),
    dueDate: hoursFromNow(-24),
    assignedTechnician: "Dan Reyes",
    estimatedCost: 380,
    paidAmount: 150,
  },
  {
    id: "a2",
    ticketNo: "TKT-002",
    customerName: "Raj Kapoor",
    device: "Samsung Galaxy S24",
    issue: "Cracked back glass",
    status: "diagnosing",
    priority: "urgent",
    createdAt: hoursFromNow(-72),
    dueDate: hoursFromNow(-6),
    assignedTechnician: "Dan Reyes",
    estimatedCost: 210,
    paidAmount: 0,
  },
  {
    id: "a3",
    ticketNo: "TKT-003",
    customerName: "Sofia Andersson",
    device: "iPad Pro 12.9",
    issue: "Face ID not working",
    status: "new",
    priority: "normal",
    createdAt: hoursFromNow(-8),
    dueDate: hoursFromNow(120),
    assignedTechnician: null,
    estimatedCost: 175,
    paidAmount: 0,
  },
  {
    id: "a4",
    ticketNo: "TKT-004",
    customerName: "Tomás Rivera",
    device: "Dell XPS 15",
    issue: "Random shutdowns",
    status: "waiting_approval",
    priority: "high",
    createdAt: hoursFromNow(-48),
    dueDate: hoursFromNow(18),
    assignedTechnician: "Lena Park",
    estimatedCost: 290,
    paidAmount: 0,
  },
  {
    id: "a5",
    ticketNo: "TKT-005",
    customerName: "Yuki Tanaka",
    device: "ThinkPad T14s",
    issue: "Trackpad button stuck",
    status: "repairing",
    priority: "low",
    createdAt: hoursFromNow(-120),
    dueDate: hoursFromNow(96),
    assignedTechnician: "Lena Park",
    estimatedCost: 130,
    paidAmount: 65,
  },
  {
    id: "a6",
    ticketNo: "TKT-006",
    customerName: "Amara Okafor",
    device: "HP Pavilion 15",
    issue: "HDD clicking noise",
    status: "delivered",
    priority: "normal",
    createdAt: hoursFromNow(-168),
    dueDate: hoursFromNow(-50),
    assignedTechnician: "Dan Reyes",
    estimatedCost: 250,
    paidAmount: 250,
  },
  {
    id: "a7",
    ticketNo: "TKT-007",
    customerName: "Liam O'Brien",
    device: "Pixel 8 Pro",
    issue: "No cellular signal",
    status: "cancelled",
    priority: "urgent",
    createdAt: hoursFromNow(-144),
    dueDate: hoursFromNow(4),
    assignedTechnician: null,
    estimatedCost: 180,
    paidAmount: 0,
  },
  {
    id: "a8",
    ticketNo: "TKT-008",
    customerName: "Nadia Petrova",
    device: "Surface Laptop 5",
    issue: "SSD read errors",
    status: "ready",
    priority: "low",
    createdAt: hoursFromNow(-72),
    dueDate: hoursFromNow(-12),
    assignedTechnician: "Lena Park",
    estimatedCost: 200,
    paidAmount: 200,
  },
  {
    id: "a9",
    ticketNo: "TKT-009",
    customerName: "Carlos Mendoza",
    device: "ROG Strix G16",
    issue: "GPU artifacting",
    status: "diagnosing",
    priority: "urgent",
    createdAt: hoursFromNow(-24),
    dueDate: hoursFromNow(168),
    assignedTechnician: "Dan Reyes",
    estimatedCost: 450,
    paidAmount: 100,
  },
  {
    id: "a10",
    ticketNo: "TKT-010",
    customerName: "Emily Zhao",
    device: "MacBook Air M3",
    issue: "Won't charge",
    status: "waiting_approval",
    priority: "high",
    createdAt: hoursFromNow(-36),
    dueDate: hoursFromNow(36),
    assignedTechnician: null,
    estimatedCost: 160,
    paidAmount: 0,
  },
  {
    id: "a11",
    ticketNo: "TKT-011",
    customerName: "Hassan Ali",
    device: "iPhone 15 Pro",
    issue: "Camera lens cracked",
    status: "new",
    priority: "low",
    createdAt: hoursFromNow(-4),
    dueDate: hoursFromNow(192),
    assignedTechnician: "Lena Park",
    estimatedCost: 140,
    paidAmount: 0,
  },
  {
    id: "a12",
    ticketNo: "TKT-012",
    customerName: "Ingrid Larsen",
    device: "Samsung Galaxy Tab A9",
    issue: "Micro-USB port broken",
    status: "repairing",
    priority: "urgent",
    createdAt: hoursFromNow(-12),
    dueDate: hoursFromNow(6),
    assignedTechnician: null,
    estimatedCost: 90,
    paidAmount: 0,
  },
];

// ──────────────────────────────────────────────────
// Example usage
// ──────────────────────────────────────────────────

const summary = getTicketSummary(dummyTickets);
console.log("=== MCTicket Report ===");
console.log("Total tickets:", summary.totalTickets);
console.log("Revenue: $", summary.totalRevenue.toFixed(2));
console.log("Paid: $", summary.totalPaid.toFixed(2));
console.log("Outstanding: $", summary.outstandingAmount.toFixed(2));
console.log("Avg value: $", summary.averageTicketValue.toFixed(2));
console.log("Completion rate:", summary.completionRate + "%");
console.log("Status counts:", summary.statusCounts);

const overdue = getOverdueTickets(dummyTickets);
console.log("\n--- Overdue ---");
for (const t of overdue) {
  console.log(
    `${t.ticketNo} ${t.customerName} [${t.priority}] due ${t.dueDate.toISOString()} — ${t.status}`
  );
}

const slaRisk = getSLARiskTickets(dummyTickets);
console.log("\n--- SLA Risk ---");
for (const t of slaRisk) {
  console.log(
    `${t.ticketNo} ${t.customerName} [${t.priority}] due ${t.dueDate.toISOString()} — ${t.status}`
  );
}

const queue = getUrgentQueue(dummyTickets);
console.log("\n--- Urgent Queue ---");
console.log("Overdue:", queue.overdue.length);
console.log("SLA Risk:", queue.slaRisk.length);
console.log("High-Priority Open:", queue.highPriorityOpen.length);
for (const t of queue.highPriorityOpen) {
  console.log(
    `  ${t.ticketNo} ${t.customerName} [${t.priority}] due ${t.dueDate.toISOString()} — ${t.status}`
  );
}
