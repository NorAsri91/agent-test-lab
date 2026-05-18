// MCTicket Reporting Module - Kimi K2 P5
// A TypeScript utility module for ticket analytics and queue management

// ============================================================================
// TYPES
// ============================================================================

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

export type UrgentQueue = {
  overdue: Ticket[];
  slaRisk: Ticket[];
  highPriorityOpen: Ticket[];
};

// ============================================================================
// CONSTANTS
// ============================================================================

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

const CLOSED_STATUSES: Status[] = ["delivered", "cancelled", "ready"];

const PRIORITY_RANK: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

// ============================================================================
// DUMMY DATASET
// ============================================================================

const now = new Date();

export const dummyTickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Alice Johnson",
    device: "MacBook Pro 2021",
    issue: "Screen flickering and backlight issues",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 450,
    paidAmount: 225,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Bob Smith",
    device: "iPhone 15 Pro",
    issue: "Battery draining fast",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 180,
    paidAmount: 90,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Carol Williams",
    device: "Dell XPS 15",
    issue: "Keyboard not working",
    status: "new",
    priority: "normal",
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 20 * 60 * 60 * 1000),
    assignedTechnician: null,
    estimatedCost: 120,
    paidAmount: 0,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "David Brown",
    device: "iPad Air 5",
    issue: "Cracked screen replacement",
    status: "repairing",
    priority: "high",
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 5 * 60 * 60 * 1000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 280,
    paidAmount: 280,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Eva Davis",
    device: "Samsung Galaxy S24",
    issue: "Water damage repair",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 350,
    paidAmount: 100,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Frank Miller",
    device: "Lenovo ThinkPad T14",
    issue: "Hard drive failure",
    status: "ready",
    priority: "normal",
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    assignedTechnician: "Tom Wilson",
    estimatedCost: 200,
    paidAmount: 200,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Grace Wilson",
    device: "MacBook Air M2",
    issue: "Software update issues",
    status: "delivered",
    priority: "low",
    createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 85,
    paidAmount: 85,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Henry Taylor",
    device: "Google Pixel 8",
    issue: "Camera not focusing",
    status: "new",
    priority: "low",
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 72 * 60 * 60 * 1000),
    assignedTechnician: null,
    estimatedCost: 150,
    paidAmount: 0,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Ivy Anderson",
    device: "Surface Pro 9",
    issue: "Won't power on",
    status: "cancelled",
    priority: "normal",
    createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    assignedTechnician: "Tom Wilson",
    estimatedCost: 300,
    paidAmount: 50,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Jack Thomas",
    device: "HP Spectre x360",
    issue: "Overheating issue",
    status: "diagnosing",
    priority: "normal",
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 36 * 60 * 60 * 1000),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 175,
    paidAmount: 87.5,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Kate Martinez",
    device: "ASUS ROG Gaming Laptop",
    issue: "Graphics card failure",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 550,
    paidAmount: 200,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Leo Garcia",
    device: "iPhone 14",
    issue: "Charging port loose",
    status: "repairing",
    priority: "normal",
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 18 * 60 * 60 * 1000),
    assignedTechnician: "Tom Wilson",
    estimatedCost: 95,
    paidAmount: 47.5,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function sortByDueDateAndPriority(a: Ticket, b: Ticket): number {
  const dateDiff = a.dueDate.getTime() - b.dueDate.getTime();
  if (dateDiff !== 0) return dateDiff;
  return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
}

function isOpenStatus(status: Status): boolean {
  return !CLOSED_STATUSES.includes(status);
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const outstandingAmount = totalRevenue - totalPaid;
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const deliveredCount = tickets.filter((t) => t.status === "delivered").length;
  const completionRate =
    totalTickets > 0
      ? Math.round((deliveredCount / totalTickets) * 100 * 10) / 10
      : 0;

  const statusCounts: Record<Status, number> = {
    new: 0,
    diagnosing: 0,
    waiting_approval: 0,
    repairing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const ticket of tickets) {
    statusCounts[ticket.status]++;
  }

  return {
    totalTickets,
    totalRevenue,
    totalPaid,
    outstandingAmount,
    averageTicketValue,
    completionRate,
    statusCounts,
  };
}

export function groupByStatus(tickets: Ticket[]): Record<Status, Ticket[]> {
  const result: Record<Status, Ticket[]> = {
    new: [],
    diagnosing: [],
    waiting_approval: [],
    repairing: [],
    ready: [],
    delivered: [],
    cancelled: [],
  };

  for (const ticket of tickets) {
    result[ticket.status].push(ticket);
  }

  return result;
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const result: Record<Priority, Ticket[]> = {
    low: [],
    normal: [],
    high: [],
    urgent: [],
  };

  for (const ticket of tickets) {
    result[ticket.priority].push(ticket);
  }

  return result;
}

export function getOverdueTickets(
  tickets: Ticket[],
  now: Date = new Date()
): Ticket[] {
  return tickets
    .filter(
      (t) =>
        t.dueDate < now &&
        !CLOSED_STATUSES.includes(t.status)
    )
    .sort(sortByDueDateAndPriority);
}

export function getSLARiskTickets(
  tickets: Ticket[],
  now: Date = new Date(),
  hoursThreshold = 24
): Ticket[] {
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;

  return tickets
    .filter((t) => {
      if (CLOSED_STATUSES.includes(t.status)) return false;
      if (t.dueDate < now) return false;

      const timeUntilDue = t.dueDate.getTime() - now.getTime();
      return timeUntilDue <= thresholdMs;
    })
    .sort(sortByDueDateAndPriority);
}

export function getUrgentQueue(
  tickets: Ticket[],
  now: Date = new Date()
): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const slaRisk = getSLARiskTickets(tickets, now);

  const overdueAndSlaIds = new Set([
    ...overdue.map((t) => t.id),
    ...slaRisk.map((t) => t.id),
  ]);

  const highPriorityOpen = tickets
    .filter(
      (t) =>
        !overdueAndSlaIds.has(t.id) &&
        isOpenStatus(t.status) &&
        (t.priority === "high" || t.priority === "urgent")
    )
    .sort(sortByDueDateAndPriority);

  return {
    overdue,
    slaRisk,
    highPriorityOpen,
  };
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

// Example usage
console.log("=== MCTicket Reporting Module Demo ===\n");

console.log("1. TICKET SUMMARY");
console.log("-" .repeat(40));
const summary = getTicketSummary(dummyTickets);
console.log(`Total Tickets: ${summary.totalTickets}`);
console.log(`Total Revenue: $${summary.totalRevenue.toFixed(2)}`);
console.log(`Total Paid: $${summary.totalPaid.toFixed(2)}`);
console.log(`Outstanding: $${summary.outstandingAmount.toFixed(2)}`);
console.log(`Average Value: $${summary.averageTicketValue.toFixed(2)}`);
console.log(`Completion Rate: ${summary.completionRate}%`);
console.log("Status Counts:");
Object.entries(summary.statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log("\n2. OVERDUE TICKETS");
console.log("-" .repeat(40));
const overdue = getOverdueTickets(dummyTickets);
if (overdue.length === 0) {
  console.log("No overdue tickets");
} else {
  overdue.forEach((t) => {
    console.log(
      `${t.ticketNo} - ${t.customerName} (${t.priority}) - Due: ${t.dueDate.toISOString().split("T")[0]}`
    );
  });
}

console.log("\n3. SLA RISK TICKETS (within 24h)");
console.log("-" .repeat(40));
const slaRisk = getSLARiskTickets(dummyTickets);
if (slaRisk.length === 0) {
  console.log("No SLA risk tickets");
} else {
  slaRisk.forEach((t) => {
    console.log(
      `${t.ticketNo} - ${t.customerName} (${t.priority}) - Due: ${t.dueDate.toISOString().split("T")[0]}`
    );
  });
}

console.log("\n4. URGENT QUEUE");
console.log("-" .repeat(40));
const urgentQueue = getUrgentQueue(dummyTickets);
console.log(`\nOverdue (${urgentQueue.overdue.length} tickets):`);
urgentQueue.overdue.forEach((t) => {
  console.log(
    `  ${t.ticketNo} - ${t.customerName} (${t.priority})`
  );
});
console.log(`\nSLA Risk (${urgentQueue.slaRisk.length} tickets):`);
urgentQueue.slaRisk.forEach((t) => {
  console.log(
    `  ${t.ticketNo} - ${t.customerName} (${t.priority})`
  );
});
console.log(`\nHigh Priority Open (${urgentQueue.highPriorityOpen.length} tickets):`);
urgentQueue.highPriorityOpen.forEach((t) => {
  console.log(
    `  ${t.ticketNo} - ${t.customerName} (${t.priority})`
  );
});

console.log("\n=== End of Demo ===");
