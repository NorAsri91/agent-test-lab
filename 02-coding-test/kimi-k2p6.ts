// MCTicket Reporting Module
// Single-file utility for ticket analytics and queue management.

export type Status =
  | "new"
  | "diagnosing"
  | "waiting_approval"
  | "repairing"
  | "ready"
  | "delivered"
  | "cancelled";

export type Priority = "low" | "normal" | "high" | "urgent";

export type Ticket = {
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
};

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

const PRIORITY_WEIGHT: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

function isTerminal(status: Status): boolean {
  return status === "delivered" || status === "cancelled" || status === "ready";
}

function compareTickets(a: Ticket, b: Ticket): number {
  const dateDiff = a.dueDate.getTime() - b.dueDate.getTime();
  if (dateDiff !== 0) return dateDiff;
  return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
}

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const deliveredCount = tickets.filter((t) => t.status === "delivered").length;
  const completionRate =
    totalTickets > 0 ? Math.round((deliveredCount / totalTickets) * 1000) / 10 : 0;

  const statusCounts = Object.fromEntries(
    ALL_STATUSES.map((s) => [
      s,
      tickets.filter((t) => t.status === s).length,
    ])
  ) as Record<Status, number>;

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
  const groups: Record<Status, Ticket[]> = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, [] as Ticket[]])
  ) as Record<Status, Ticket[]>;

  for (const ticket of tickets) {
    groups[ticket.status].push(ticket);
  }

  return groups;
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const groups: Record<Priority, Ticket[]> = Object.fromEntries(
    ALL_PRIORITIES.map((p) => [p, [] as Ticket[]])
  ) as Record<Priority, Ticket[]>;

  for (const ticket of tickets) {
    groups[ticket.priority].push(ticket);
  }

  return groups;
}

export function getOverdueTickets(
  tickets: Ticket[],
  now: Date = new Date()
): Ticket[] {
  const nowTime = now.getTime();
  return tickets
    .filter((t) => t.dueDate.getTime() < nowTime && !isTerminal(t.status))
    .sort(compareTickets);
}

export function getSLARiskTickets(
  tickets: Ticket[],
  now: Date = new Date(),
  hoursThreshold = 24
): Ticket[] {
  const nowTime = now.getTime();
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;

  return tickets
    .filter((t) => {
      if (isTerminal(t.status)) return false;
      const due = t.dueDate.getTime();
      return due >= nowTime && due - nowTime <= thresholdMs;
    })
    .sort(compareTickets);
}

export function getUrgentQueue(
  tickets: Ticket[],
  now: Date = new Date()
): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const slaRisk = getSLARiskTickets(tickets, now);

  const excludedIds = new Set([...overdue, ...slaRisk].map((t) => t.id));

  const highPriorityOpen = tickets
    .filter((t) => {
      if (isTerminal(t.status)) return false;
      if (excludedIds.has(t.id)) return false;
      return t.priority === "high" || t.priority === "urgent";
    })
    .sort(compareTickets);

  return { overdue, slaRisk, highPriorityOpen };
}

export const dummyTickets: Ticket[] = [
  {
    id: "t1",
    ticketNo: "TKT-001",
    customerName: "Alice Chen",
    device: "MacBook Pro 2021",
    issue: "Battery not charging",
    status: "delivered",
    priority: "normal",
    createdAt: new Date("2025-09-01T09:00:00Z"),
    dueDate: new Date("2025-09-05T17:00:00Z"),
    assignedTechnician: "Dave Park",
    estimatedCost: 320,
    paidAmount: 320,
  },
  {
    id: "t2",
    ticketNo: "TKT-002",
    customerName: "Bob Smith",
    device: "iPhone 15 Pro",
    issue: "Cracked screen",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2025-09-10T10:00:00Z"),
    dueDate: new Date("2025-09-12T17:00:00Z"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 280,
    paidAmount: 140,
  },
  {
    id: "t3",
    ticketNo: "TKT-003",
    customerName: "Carol Nguyen",
    device: "Dell XPS 13",
    issue: "Blue screen loop",
    status: "diagnosing",
    priority: "urgent",
    createdAt: new Date("2025-09-08T08:00:00Z"),
    dueDate: new Date("2025-09-11T12:00:00Z"),
    assignedTechnician: null,
    estimatedCost: 150,
    paidAmount: 0,
  },
  {
    id: "t4",
    ticketNo: "TKT-004",
    customerName: "Dan Evans",
    device: "iPad Air 5",
    issue: "Touchscreen unresponsive",
    status: "waiting_approval",
    priority: "normal",
    createdAt: new Date("2025-09-09T11:00:00Z"),
    dueDate: new Date("2025-09-14T17:00:00Z"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 200,
    paidAmount: 50,
  },
  {
    id: "t5",
    ticketNo: "TKT-005",
    customerName: "Eva Martinez",
    device: "Samsung Galaxy S24",
    issue: "Water damage",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2025-09-05T14:00:00Z"),
    dueDate: new Date("2025-09-07T17:00:00Z"),
    assignedTechnician: null,
    estimatedCost: 400,
    paidAmount: 100,
  },
  {
    id: "t6",
    ticketNo: "TKT-006",
    customerName: "Frank Zhang",
    device: "HP Spectre x360",
    issue: "Keyboard failure",
    status: "ready",
    priority: "high",
    createdAt: new Date("2025-09-06T09:30:00Z"),
    dueDate: new Date("2025-09-10T17:00:00Z"),
    assignedTechnician: "Dave Park",
    estimatedCost: 180,
    paidAmount: 180,
  },
  {
    id: "t7",
    ticketNo: "TKT-007",
    customerName: "Grace Okafor",
    device: "Lenovo ThinkPad T14",
    issue: "Slow performance",
    status: "new",
    priority: "low",
    createdAt: new Date("2025-09-12T07:00:00Z"),
    dueDate: new Date("2025-09-20T17:00:00Z"),
    assignedTechnician: null,
    estimatedCost: 120,
    paidAmount: 0,
  },
  {
    id: "t8",
    ticketNo: "TKT-008",
    customerName: "Henry Wilson",
    device: "Asus ROG Strix",
    issue: "Overheating during gaming",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2025-09-11T13:00:00Z"),
    dueDate: new Date("2025-09-13T17:00:00Z"),
    assignedTechnician: "Dave Park",
    estimatedCost: 250,
    paidAmount: 125,
  },
  {
    id: "t9",
    ticketNo: "TKT-009",
    customerName: "Iris Tanaka",
    device: "Microsoft Surface Pro 9",
    issue: "Pen not pairing",
    status: "diagnosing",
    priority: "normal",
    createdAt: new Date("2025-09-10T09:00:00Z"),
    dueDate: new Date("2025-09-16T17:00:00Z"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 95,
    paidAmount: 0,
  },
  {
    id: "t10",
    ticketNo: "TKT-010",
    customerName: "Jack Brown",
    device: "Google Pixel 8",
    issue: "Camera autofocus stuck",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date("2025-09-09T15:00:00Z"),
    dueDate: new Date("2025-09-12T17:00:00Z"),
    assignedTechnician: "Dave Park",
    estimatedCost: 160,
    paidAmount: 80,
  },
  {
    id: "t11",
    ticketNo: "TKT-011",
    customerName: "Kelly Adams",
    device: "Acer Swift 3",
    issue: "Wi-Fi disconnects randomly",
    status: "new",
    priority: "normal",
    createdAt: new Date("2025-09-13T10:00:00Z"),
    dueDate: new Date("2025-09-18T17:00:00Z"),
    assignedTechnician: null,
    estimatedCost: 110,
    paidAmount: 0,
  },
];

// Example usage
if (require.main === module) {
  console.log("=== Ticket Summary ===");
  console.log(getTicketSummary(dummyTickets));

  console.log("\n=== Overdue Tickets ===");
  console.log(getOverdueTickets(dummyTickets));

  console.log("\n=== SLA Risk Tickets ===");
  console.log(getSLARiskTickets(dummyTickets));

  console.log("\n=== Urgent Queue ===");
  console.log(getUrgentQueue(dummyTickets));
}
