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

const ALL_STATUSES: Status[] = ["new", "diagnosing", "waiting_approval", "repairing", "ready", "delivered", "cancelled"];
const ALL_PRIORITIES: Priority[] = ["low", "normal", "high", "urgent"];

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const COMPLETED_STATUSES: Status[] = ["delivered", "cancelled", "ready"];

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const outstandingAmount = totalRevenue - totalPaid;
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const deliveredCount = tickets.filter(t => t.status === "delivered").length;
  const completionRate = totalTickets > 0 ? Math.round((deliveredCount / totalTickets) * 1000) / 10 : 0;

  const statusCounts: Record<Status, number> = {} as Record<Status, number>;
  for (const status of ALL_STATUSES) {
    statusCounts[status] = 0;
  }
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
  const result: Record<Status, Ticket[]> = {} as Record<Status, Ticket[]>;
  for (const status of ALL_STATUSES) {
    result[status] = [];
  }
  for (const ticket of tickets) {
    result[ticket.status].push(ticket);
  }
  return result;
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  const result: Record<Priority, Ticket[]> = {} as Record<Priority, Ticket[]>;
  for (const priority of ALL_PRIORITIES) {
    result[priority] = [];
  }
  for (const ticket of tickets) {
    result[ticket.priority].push(ticket);
  }
  return result;
}

export function getOverdueTickets(tickets: Ticket[], now: Date = new Date()): Ticket[] {
  return tickets
    .filter(t => t.dueDate < now && !COMPLETED_STATUSES.includes(t.status))
    .sort((a, b) => {
      const dateCompare = a.dueDate.getTime() - b.dueDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    });
}

export function getSLARiskTickets(tickets: Ticket[], now: Date = new Date(), hoursThreshold = 24): Ticket[] {
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;
  return tickets
    .filter(t => {
      if (COMPLETED_STATUSES.includes(t.status)) return false;
      if (t.dueDate < now) return false;
      const diffMs = t.dueDate.getTime() - now.getTime();
      return diffMs <= thresholdMs;
    })
    .sort((a, b) => {
      const dateCompare = a.dueDate.getTime() - b.dueDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    });
}

export function getUrgentQueue(tickets: Ticket[], now: Date = new Date()): UrgentQueue {
  const overdue = getOverdueTickets(tickets, now);
  const overdueIds = new Set(overdue.map(t => t.id));

  const slaRisk = getSLARiskTickets(tickets, now).filter(t => !overdueIds.has(t.id));
  const slaRiskIds = new Set(slaRisk.map(t => t.id));

  const highPriorityOpen = tickets
    .filter(t => {
      if (overdueIds.has(t.id) || slaRiskIds.has(t.id)) return false;
      if (COMPLETED_STATUSES.includes(t.status)) return false;
      return t.priority === "high" || t.priority === "urgent";
    })
    .sort((a, b) => {
      const dateCompare = a.dueDate.getTime() - b.dueDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    });

  return { overdue, slaRisk, highPriorityOpen };
}

export const dummyTickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "Alice Johnson",
    device: "MacBook Pro 2021",
    issue: "Screen flickering",
    status: "new",
    priority: "high",
    createdAt: new Date("2024-01-10"),
    dueDate: new Date("2024-01-15"),
    assignedTechnician: null,
    estimatedCost: 350,
    paidAmount: 0,
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Bob Smith",
    device: "iPhone 14 Pro",
    issue: "Battery replacement",
    status: "repairing",
    priority: "normal",
    createdAt: new Date("2024-01-08"),
    dueDate: new Date("2024-01-12"),
    assignedTechnician: "Mike Wilson",
    estimatedCost: 120,
    paidAmount: 60,
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Carol Davis",
    device: "Dell XPS 15",
    issue: "Keyboard not responding",
    status: "diagnosing",
    priority: "urgent",
    createdAt: new Date("2024-01-11"),
    dueDate: new Date("2024-01-13"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 200,
    paidAmount: 50,
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "David Brown",
    device: "iPad Pro 12.9",
    issue: "Cracked screen",
    status: "waiting_approval",
    priority: "normal",
    createdAt: new Date("2024-01-05"),
    dueDate: new Date("2024-01-18"),
    assignedTechnician: "Tom Harris",
    estimatedCost: 450,
    paidAmount: 100,
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Emma Wilson",
    device: "Samsung Galaxy S23",
    issue: "Charging port issue",
    status: "ready",
    priority: "low",
    createdAt: new Date("2024-01-02"),
    dueDate: new Date("2024-01-09"),
    assignedTechnician: "Mike Wilson",
    estimatedCost: 80,
    paidAmount: 80,
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Frank Miller",
    device: "HP Spectre x360",
    issue: "Motherboard failure",
    status: "delivered",
    priority: "high",
    createdAt: new Date("2024-01-01"),
    dueDate: new Date("2024-01-07"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 600,
    paidAmount: 600,
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "Grace Lee",
    device: "Google Pixel 7",
    issue: "Camera not working",
    status: "cancelled",
    priority: "normal",
    createdAt: new Date("2024-01-03"),
    dueDate: new Date("2024-01-10"),
    assignedTechnician: null,
    estimatedCost: 150,
    paidAmount: 0,
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Henry Chen",
    device: "Lenovo ThinkPad X1",
    issue: "Overheating",
    status: "new",
    priority: "low",
    createdAt: new Date("2024-01-12"),
    dueDate: new Date("2024-01-25"),
    assignedTechnician: null,
    estimatedCost: 180,
    paidAmount: 0,
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Ivy Martinez",
    device: "MacBook Air M2",
    issue: "SSD upgrade",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2024-01-09"),
    dueDate: new Date("2024-01-11"),
    assignedTechnician: "Tom Harris",
    estimatedCost: 300,
    paidAmount: 150,
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Jack Robinson",
    device: "Surface Pro 9",
    issue: "Touch screen calibration",
    status: "diagnosing",
    priority: "high",
    createdAt: new Date("2024-01-10"),
    dueDate: new Date("2024-01-14"),
    assignedTechnician: "Sarah Lee",
    estimatedCost: 175,
    paidAmount: 0,
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Karen White",
    device: "ASUS ROG Strix",
    issue: "GPU replacement",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date("2024-01-11"),
    dueDate: new Date("2024-01-16"),
    assignedTechnician: null,
    estimatedCost: 500,
    paidAmount: 100,
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Leo Garcia",
    device: "iPhone 13",
    issue: "Water damage",
    status: "new",
    priority: "normal",
    createdAt: new Date("2024-01-12"),
    dueDate: new Date("2024-01-20"),
    assignedTechnician: "Mike Wilson",
    estimatedCost: 250,
    paidAmount: 50,
  },
];

// Example usage
const now = new Date("2024-01-12T12:00:00");

console.log("=== Ticket Summary ===");
const summary = getTicketSummary(dummyTickets);
console.log(`Total Tickets: ${summary.totalTickets}`);
console.log(`Total Revenue: $${summary.totalRevenue}`);
console.log(`Total Paid: $${summary.totalPaid}`);
console.log(`Outstanding: $${summary.outstandingAmount}`);
console.log(`Avg Ticket Value: $${summary.averageTicketValue.toFixed(2)}`);
console.log(`Completion Rate: ${summary.completionRate}%`);
console.log("Status Counts:", summary.statusCounts);

console.log("\n=== Overdue Tickets ===");
const overdue = getOverdueTickets(dummyTickets, now);
overdue.forEach(t => console.log(`[${t.ticketNo}] ${t.customerName} - ${t.device} (Due: ${t.dueDate.toDateString()}, Priority: ${t.priority})`));

console.log("\n=== SLA Risk Tickets ===");
const slaRisk = getSLARiskTickets(dummyTickets, now, 24);
slaRisk.forEach(t => console.log(`[${t.ticketNo}] ${t.customerName} - ${t.device} (Due: ${t.dueDate.toDateString()}, Priority: ${t.priority})`));

console.log("\n=== Urgent Queue ===");
const urgentQueue = getUrgentQueue(dummyTickets, now);
console.log(`Overdue (${urgentQueue.overdue.length}):`);
urgentQueue.overdue.forEach(t => console.log(`  [${t.ticketNo}] ${t.customerName} - Priority: ${t.priority}`));
console.log(`SLA Risk (${urgentQueue.slaRisk.length}):`);
urgentQueue.slaRisk.forEach(t => console.log(`  [${t.ticketNo}] ${t.customerName} - Priority: ${t.priority}`));
console.log(`High Priority Open (${urgentQueue.highPriorityOpen.length}):`);
urgentQueue.highPriorityOpen.forEach(t => console.log(`  [${t.ticketNo}] ${t.customerName} - Priority: ${t.priority}`));
