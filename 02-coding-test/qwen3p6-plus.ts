// Types
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
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3,
};

function compareTickets(a: Ticket, b: Ticket): number {
  const dateDiff = a.dueDate.getTime() - b.dueDate.getTime();
  if (dateDiff !== 0) return dateDiff;
  return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
}

function isTerminalStatus(status: Status): boolean {
  return status === "delivered" || status === "cancelled" || status === "ready";
}

function cloneAndSort(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort(compareTickets);
}

// 1. getTicketSummary
export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const outstandingAmount = totalRevenue - totalPaid;
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const deliveredCount = tickets.filter(
    (t) => t.status === "delivered"
  ).length;
  const completionRate =
    totalTickets > 0
      ? Math.round((deliveredCount / totalTickets) * 1000) / 10
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
  for (const t of tickets) {
    statusCounts[t.status]++;
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

// 2. groupByStatus
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
  for (const t of tickets) {
    result[t.status].push(t);
  }
  return result;
}

// 3. groupByPriority
export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const result: Record<Priority, Ticket[]> = {
    low: [],
    normal: [],
    high: [],
    urgent: [],
  };
  for (const t of tickets) {
    result[t.priority].push(t);
  }
  return result;
}

// 4. getOverdueTickets
export function getOverdueTickets(
  tickets: Ticket[],
  now: Date = new Date()
): Ticket[] {
  const overdue = tickets.filter(
    (t) => t.dueDate < now && !isTerminalStatus(t.status)
  );
  return cloneAndSort(overdue);
}

// 5. getSLARiskTickets
export function getSLARiskTickets(
  tickets: Ticket[],
  now: Date = new Date(),
  hoursThreshold: number = 24
): Ticket[] {
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;
  const slaRisk = tickets.filter((t) => {
    if (isTerminalStatus(t.status)) return false;
    const isOverdue = t.dueDate < now;
    if (isOverdue) return false;
    const timeUntilDue = t.dueDate.getTime() - now.getTime();
    return timeUntilDue <= thresholdMs;
  });
  return cloneAndSort(slaRisk);
}

// 6. getUrgentQueue
export function getUrgentQueue(
  tickets: Ticket[],
  now: Date = new Date()
): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const slaRisk = getSLARiskTickets(tickets, now);

  const overdueIds = new Set(overdue.map((t) => t.id));
  const slaRiskIds = new Set(slaRisk.map((t) => t.id));

  const highPriorityOpen = tickets.filter((t) => {
    if (isTerminalStatus(t.status)) return false;
    if (t.priority !== "high" && t.priority !== "urgent") return false;
    if (overdueIds.has(t.id)) return false;
    if (slaRiskIds.has(t.id)) return false;
    return true;
  });

  return {
    overdue: cloneAndSort(overdue),
    slaRisk: cloneAndSort(slaRisk),
    highPriorityOpen: cloneAndSort(highPriorityOpen),
  };
}

// Dummy Dataset
const DUMMY_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Alice Johnson",
    device: "MacBook Pro 2021",
    issue: "Screen flickering and battery drains fast",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2025-01-10T09:00:00"),
    dueDate: new Date("2025-01-12T17:00:00"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 350,
    paidAmount: 100,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Bob Smith",
    device: "Dell XPS 15",
    issue: "Won't boot — suspected motherboard failure",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date("2025-01-08T14:30:00"),
    dueDate: new Date("2025-01-10T12:00:00"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 520,
    paidAmount: 0,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Carol Davis",
    device: "iPhone 14 Pro",
    issue: "Cracked back glass, camera not working",
    status: "repairing",
    priority: "normal",
    createdAt: new Date("2025-01-09T10:15:00"),
    dueDate: new Date("2025-01-13T16:00:00"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 220,
    paidAmount: 100,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Dave Wilson",
    device: "HP Pavilion Gaming PC",
    issue: "Overheating during gaming sessions",
    status: "new",
    priority: "low",
    createdAt: new Date("2025-01-11T08:00:00"),
    dueDate: new Date("2025-01-18T12:00:00"),
    assignedTechnician: null,
    estimatedCost: 180,
    paidAmount: 0,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Eva Martinez",
    device: "iPad Air",
    issue: "Touch screen unresponsive in top-right quadrant",
    status: "ready",
    priority: "normal",
    createdAt: new Date("2025-01-05T11:00:00"),
    dueDate: new Date("2025-01-08T15:00:00"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 150,
    paidAmount: 150,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Frank Turner",
    device: "Lenovo ThinkPad T490",
    issue: "Keyboard keys sticking, needs replacement",
    status: "delivered",
    priority: "low",
    createdAt: new Date("2025-01-02T09:30:00"),
    dueDate: new Date("2025-01-06T14:00:00"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 95,
    paidAmount: 95,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Grace Kim",
    device: "Samsung Galaxy S23",
    issue: "Water damage — dropped in pool",
    status: "diagnosing",
    priority: "urgent",
    createdAt: new Date("2025-01-10T16:45:00"),
    dueDate: new Date("2025-01-11T12:00:00"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 280,
    paidAmount: 50,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Henry Adams",
    device: "ASUS ROG Laptop",
    issue: "Blue screen on startup, possible SSD failure",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date("2025-01-07T13:00:00"),
    dueDate: new Date("2025-01-09T17:00:00"),
    assignedTechnician: null,
    estimatedCost: 430,
    paidAmount: 200,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Iris Chen",
    device: "Microsoft Surface Pro 8",
    issue: "Battery swollen, won't charge past 40%",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2025-01-09T08:30:00"),
    dueDate: new Date("2025-01-11T18:00:00"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 310,
    paidAmount: 150,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Jack Brown",
    device: "Acer Chromebook",
    issue: "Screen won't turn on, but powers up",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2025-01-04T10:00:00"),
    dueDate: new Date("2025-01-09T12:00:00"),
    assignedTechnician: null,
    estimatedCost: 120,
    paidAmount: 60,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Karen White",
    device: "HP Envy x360",
    issue: "Hinge broken, screen wobbles",
    status: "new",
    priority: "normal",
    createdAt: new Date("2025-01-11T15:30:00"),
    dueDate: new Date("2025-01-14T10:00:00"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 200,
    paidAmount: 0,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Leo Park",
    device: "iPhone 13",
    issue: "No cellular signal after iOS update",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2025-01-06T11:00:00"),
    dueDate: new Date("2025-01-09T16:00:00"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 175,
    paidAmount: 80,
  },
];

// Example usage
if (require.main === module) {
  console.log("=== MCTicket Report ===\n");

  const summary = getTicketSummary(DUMMY_TICKETS);
  console.log("Ticket Summary:");
  console.log(`  Total Tickets:    ${summary.totalTickets}`);
  console.log(`  Total Revenue:    $${summary.totalRevenue.toFixed(2)}`);
  console.log(`  Total Paid:       $${summary.totalPaid.toFixed(2)}`);
  console.log(
    `  Outstanding:      $${summary.outstandingAmount.toFixed(2)}`
  );
  console.log(
    `  Average Ticket:   $${summary.averageTicketValue.toFixed(2)}`
  );
  console.log(
    `  Completion Rate:  ${summary.completionRate}%`
  );
  console.log(`  Status Counts:`);
  for (const [status, count] of Object.entries(summary.statusCounts)) {
    console.log(`    ${status}: ${count}`);
  }

  console.log("\n--- Overdue Tickets ---");
  const now = new Date("2025-01-12T10:00:00");
  const overdue = getOverdueTickets(DUMMY_TICKETS, now);
  if (overdue.length === 0) {
    console.log("  None");
  } else {
    for (const t of overdue) {
      console.log(
        `  ${t.ticketNo} | ${t.device} | ${t.status} | ${t.priority} | Due: ${t.dueDate.toLocaleString()}`
      );
    }
  }

  console.log("\n--- SLA Risk Tickets (within 24h) ---");
  const slaRisk = getSLARiskTickets(DUMMY_TICKETS, now, 24);
  if (slaRisk.length === 0) {
    console.log("  None");
  } else {
    for (const t of slaRisk) {
      console.log(
        `  ${t.ticketNo} | ${t.device} | ${t.status} | ${t.priority} | Due: ${t.dueDate.toLocaleString()}`
      );
    }
  }

  console.log("\n--- Urgent Queue ---");
  const queue = getUrgentQueue(DUMMY_TICKETS, now);
  console.log("Overdue:");
  for (const t of queue.overdue) {
    console.log(`  ${t.ticketNo} | ${t.device} | ${t.priority} | Due: ${t.dueDate.toLocaleString()}`);
  }
  if (queue.overdue.length === 0) console.log("  None");
  console.log("SLA Risk:");
  for (const t of queue.slaRisk) {
    console.log(`  ${t.ticketNo} | ${t.device} | ${t.priority} | Due: ${t.dueDate.toLocaleString()}`);
  }
  if (queue.slaRisk.length === 0) console.log("  None");
  console.log("High Priority Open:");
  for (const t of queue.highPriorityOpen) {
    console.log(`  ${t.ticketNo} | ${t.device} | ${t.priority} | Due: ${t.dueDate.toLocaleString()}`);
  }
  if (queue.highPriorityOpen.length === 0) console.log("  None");
}
