export type Status = "new" | "diagnosing" | "waiting_approval" | "repairing" | "ready" | "delivered" | "cancelled";

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

export type TicketSummary = {
  totalTickets: number;
  totalRevenue: number;
  totalPaid: number;
  outstandingAmount: number;
  averageTicketValue: number;
  completionRate: number;
  statusCounts: Record<Status, number>;
};

export type UrgentQueue = {
  overdue: Ticket[];
  slaRisk: Ticket[];
  highPriorityOpen: Ticket[];
};

const ALL_STATUSES: Status[] = [
  "new",
  "diagnosing",
  "waiting_approval",
  "repairing",
  "ready",
  "delivered",
  "cancelled",
];

const ALL_PRIORITIES: Priority[] = ["low", "normal", "high", "urgent"];

const PRIORITY_RANK: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const CLOSED_STATUSES: ReadonlySet<Status> = new Set(["delivered", "cancelled", "ready"]);

function sortByDueThenPriority(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const dueDiff = a.dueDate.getTime() - b.dueDate.getTime();
    if (dueDiff !== 0) return dueDiff;
    return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
  });
}

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const averageTicketValue = totalTickets === 0 ? 0 : totalRevenue / totalTickets;

  const deliveredCount = tickets.filter((t) => t.status === "delivered").length;
  const completionRate =
    totalTickets === 0 ? 0 : Math.round((deliveredCount / totalTickets) * 1000) / 10;

  const statusCounts = {} as Record<Status, number>;
  for (const s of ALL_STATUSES) {
    statusCounts[s] = tickets.filter((t) => t.status === s).length;
  }

  return {
    totalTickets,
    totalRevenue,
    totalPaid,
    outstandingAmount: totalRevenue - totalPaid,
    averageTicketValue,
    completionRate,
    statusCounts,
  };
}

export function groupByStatus(tickets: Ticket[]): Record<Status, Ticket[]> {
  const result = {} as Record<Status, Ticket[]>;
  for (const s of ALL_STATUSES) {
    result[s] = [];
  }
  for (const t of tickets) {
    result[t.status].push(t);
  }
  return result;
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const result = {} as Record<Priority, Ticket[]>;
  for (const p of ALL_PRIORITIES) {
    result[p] = [];
  }
  for (const t of tickets) {
    result[t.priority].push(t);
  }
  return result;
}

export function getOverdueTickets(tickets: Ticket[], now: Date = new Date()): Ticket[] {
  const nowMs = now.getTime();
  const overdue = tickets.filter(
    (t) => t.dueDate.getTime() < nowMs && !CLOSED_STATUSES.has(t.status)
  );
  return sortByDueThenPriority(overdue);
}

export function getSLARiskTickets(
  tickets: Ticket[],
  now: Date = new Date(),
  hoursThreshold = 24
): Ticket[] {
  const nowMs = now.getTime();
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;
  const slaRisk = tickets.filter((t) => {
    if (CLOSED_STATUSES.has(t.status)) return false;
    const dueMs = t.dueDate.getTime();
    return dueMs >= nowMs && dueMs <= nowMs + thresholdMs;
  });
  return sortByDueThenPriority(slaRisk);
}

export function getUrgentQueue(tickets: Ticket[], now: Date = new Date()): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const slaRisk = getSLARiskTickets(tickets, now);

  const inUrgent = new Set<string>();
  for (const t of overdue) inUrgent.add(t.id);
  for (const t of slaRisk) inUrgent.add(t.id);

  const highPriorityOpen = tickets.filter(
    (t) =>
      !CLOSED_STATUSES.has(t.status) &&
      !inUrgent.has(t.id) &&
      (t.priority === "high" || t.priority === "urgent")
  );

  return {
    overdue,
    slaRisk,
    highPriorityOpen: sortByDueThenPriority(highPriorityOpen),
  };
}

function offsetHours(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export const dummyTickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Alice Johnson",
    device: "MacBook Pro 2021",
    issue: "Screen flickers intermittently",
    status: "repairing",
    priority: "high",
    createdAt: offsetHours(-120),
    dueDate: offsetHours(-72),
    assignedTechnician: "Bob Smith",
    estimatedCost: 350,
    paidAmount: 100,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Brian Cole",
    device: "iPhone 14",
    issue: "Cracked screen",
    status: "diagnosing",
    priority: "urgent",
    createdAt: offsetHours(-96),
    dueDate: offsetHours(-48),
    assignedTechnician: "Bob Smith",
    estimatedCost: 220,
    paidAmount: 0,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Catherine Diaz",
    device: "Samsung Galaxy Tab S8",
    issue: "Battery drains quickly",
    status: "new",
    priority: "normal",
    createdAt: offsetHours(-12),
    dueDate: offsetHours(8),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 120,
    paidAmount: 0,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Derek Nguyen",
    device: "HP LaserJet Pro",
    issue: "Paper jam error persists",
    status: "waiting_approval",
    priority: "high",
    createdAt: offsetHours(-24),
    dueDate: offsetHours(20),
    assignedTechnician: null,
    estimatedCost: 180,
    paidAmount: 0,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Elena Rossi",
    device: "Dell Optiplex 7080",
    issue: "Won't power on",
    status: "repairing",
    priority: "low",
    createdAt: offsetHours(-48),
    dueDate: offsetHours(72),
    assignedTechnician: "Bob Smith",
    estimatedCost: 400,
    paidAmount: 200,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Frank Osei",
    device: "Lenovo ThinkPad X1",
    issue: "Keyboard not responding",
    status: "delivered",
    priority: "normal",
    createdAt: offsetHours(-96),
    dueDate: offsetHours(-1),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 150,
    paidAmount: 150,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Grace Kim",
    device: "iPhone 13",
    issue: "Water damage",
    status: "cancelled",
    priority: "urgent",
    createdAt: offsetHours(-168),
    dueDate: offsetHours(1),
    assignedTechnician: "Bob Smith",
    estimatedCost: 290,
    paidAmount: 0,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Hector Vargas",
    device: "iPad Air 4",
    issue: "Charging port loose",
    status: "ready",
    priority: "low",
    createdAt: offsetHours(-72),
    dueDate: offsetHours(-10),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 80,
    paidAmount: 80,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Irene Bakker",
    device: "ASUS ROG Gaming Laptop",
    issue: "GPU overheating",
    status: "diagnosing",
    priority: "urgent",
    createdAt: offsetHours(-48),
    dueDate: offsetHours(96),
    assignedTechnician: "Mike Chen",
    estimatedCost: 500,
    paidAmount: 100,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "James Wallace",
    device: "MacBook Air M2",
    issue: "Liquid spill on keyboard",
    status: "waiting_approval",
    priority: "high",
    createdAt: offsetHours(-36),
    dueDate: offsetHours(48),
    assignedTechnician: null,
    estimatedCost: 320,
    paidAmount: 0,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Kendra Patel",
    device: "Microsoft Surface Pro 9",
    issue: "Touchscreen unresponsive",
    status: "new",
    priority: "normal",
    createdAt: offsetHours(-6),
    dueDate: offsetHours(168),
    assignedTechnician: "Mike Chen",
    estimatedCost: 260,
    paidAmount: 0,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Leo Thompson",
    device: "Samsung Galaxy S23",
    issue: "Speaker crackling",
    status: "repairing",
    priority: "urgent",
    createdAt: offsetHours(-4),
    dueDate: offsetHours(2),
    assignedTechnician: null,
    estimatedCost: 95,
    paidAmount: 0,
  },
];

// ──────────────────────────────────────────────────
// Example usage
// ──────────────────────────────────────────────────

console.log("═".repeat(60));
console.log("MCTicket Reporting — Example Usage");
console.log("═".repeat(60));

const summary = getTicketSummary(dummyTickets);
console.log("\n📊 Ticket Summary");
console.log("  Total Tickets:       ", summary.totalTickets);
console.log("  Total Revenue:       $", summary.totalRevenue.toFixed(2));
console.log("  Total Paid:          $", summary.totalPaid.toFixed(2));
console.log("  Outstanding:         $", summary.outstandingAmount.toFixed(2));
console.log("  Average Value:       $", summary.averageTicketValue.toFixed(2));
console.log("  Completion Rate:      ", summary.completionRate, "%");
console.log("  Status Counts:");
for (const [status, count] of Object.entries(summary.statusCounts)) {
  console.log(`    ${status.padEnd(18)} ${count}`);
}

const overdue = getOverdueTickets(dummyTickets);
console.log("\n⏰ Overdue Tickets (%d)", overdue.length);
for (const t of overdue) {
  console.log(
    `  ${t.ticketNo.padEnd(8)} ${t.customerName.padEnd(18)} ${t.priority.padEnd(8)} due ${t.dueDate.toLocaleDateString()} — ${t.status}`
  );
}

const slaRisk = getSLARiskTickets(dummyTickets);
console.log("\n⚠️  SLA Risk Tickets (%d)", slaRisk.length);
for (const t of slaRisk) {
  console.log(
    `  ${t.ticketNo.padEnd(8)} ${t.customerName.padEnd(18)} ${t.priority.padEnd(8)} due ${t.dueDate.toLocaleDateString()} — ${t.status}`
  );
}

const queue = getUrgentQueue(dummyTickets);
console.log("\n🚨 Urgent Queue Summary");
console.log("  Overdue:             ", queue.overdue.length, "tickets");
console.log("  SLA Risk:            ", queue.slaRisk.length, "tickets");
console.log("  High-Priority Open:  ", queue.highPriorityOpen.length, "tickets");
console.log("  Total Urgent:        ", queue.overdue.length + queue.slaRisk.length + queue.highPriorityOpen.length);
if (queue.highPriorityOpen.length > 0) {
  console.log("\n  High-Priority Open (not overdue/at-risk):");
  for (const t of queue.highPriorityOpen) {
    console.log(
      `    ${t.ticketNo.padEnd(8)} ${t.customerName.padEnd(18)} ${t.priority.padEnd(8)} due ${t.dueDate.toLocaleDateString()} — ${t.status}`
    );
  }
}
console.log("\n" + "═".repeat(60));
