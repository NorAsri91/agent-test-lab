// MCTicket TypeScript Coding Test - Minimax M2 P7

type Status = "new" | "diagnosing" | "waiting_approval" | "repairing" | "ready" | "delivered" | "cancelled";
type Priority = "low" | "normal" | "high" | "urgent";

interface Ticket {
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

type TicketSummary = {
  totalTickets: number;
  totalRevenue: number;
  totalPaid: number;
  outstandingAmount: number;
  averageTicketValue: number;
  completionRate: number;
  statusCounts: Record<Status, number>;
};

type UrgentQueue = {
  overdue: Ticket[];
  slaRisk: Ticket[];
  highPriorityOpen: Ticket[];
};

const ALL_STATUSES: Status[] = ["new", "diagnosing", "waiting_approval", "repairing", "ready", "delivered", "cancelled"];
const ALL_PRIORITIES: Priority[] = ["low", "normal", "high", "urgent"];
const PRIORITY_ORDER: Record<Priority, number> = { urgent: 4, high: 3, normal: 2, low: 1 };

const RESOLVED_STATUSES: Set<Status> = new Set(["delivered", "cancelled", "ready"]);

function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const dateCompare = a.dueDate.getTime() - b.dueDate.getTime();
    if (dateCompare !== 0) return dateCompare;
    return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
  });
}

export function getTicketSummary(tickets: Ticket[]): TicketSummary {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.estimatedCost, 0);
  const totalPaid = tickets.reduce((sum, t) => sum + t.paidAmount, 0);
  const outstandingAmount = totalRevenue - totalPaid;
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const deliveredCount = tickets.filter(t => t.status === "delivered").length;
  const completionRate = totalTickets > 0 ? Math.round((deliveredCount / totalTickets) * 100 * 10) / 10 : 0;

  const statusCounts = ALL_STATUSES.reduce((acc, status) => {
    acc[status] = tickets.filter(t => t.status === status).length;
    return acc;
  }, {} as Record<Status, number>);

  return {
    totalTickets,
    totalRevenue,
    totalPaid,
    outstandingAmount,
    averageTicketValue,
    completionRate,
    statusCounts
  };
}

export function groupByStatus(tickets: Ticket[]): Record<Status, Ticket[]> {
  return ALL_STATUSES.reduce((acc, status) => {
    acc[status] = tickets.filter(t => t.status === status);
    return acc;
  }, {} as Record<Status, Ticket[]>);
}

export function groupByPriority(tickets: Ticket[]): Record<Priority, Ticket[]> {
  return ALL_PRIORITIES.reduce((acc, priority) => {
    acc[priority] = tickets.filter(t => t.priority === priority);
    return acc;
  }, {} as Record<Priority, Ticket[]>);
}

export function getOverdueTickets(tickets: Ticket[], now: Date = new Date()): Ticket[] {
  const overdue = tickets.filter(t =>
    t.dueDate.getTime() < now.getTime() && !RESOLVED_STATUSES.has(t.status)
  );
  return sortTickets(overdue);
}

export function getSLARiskTickets(tickets: Ticket[], now: Date = new Date(), hoursThreshold: number = 24): Ticket[] {
  const thresholdTime = now.getTime() + hoursThreshold * 60 * 60 * 1000;
  const atRisk = tickets.filter(t =>
    t.dueDate.getTime() >= now.getTime() &&
    t.dueDate.getTime() <= thresholdTime &&
    !RESOLVED_STATUSES.has(t.status)
  );
  return sortTickets(atRisk);
}

export function getUrgentQueue(tickets: Ticket[], now: Date = new Date()): UrgentQueue {
  const overdueThreshold = now.getTime();
  const slaThreshold = now.getTime() + 24 * 60 * 60 * 1000;

  const overdue = tickets.filter(t =>
    t.dueDate.getTime() < overdueThreshold && !RESOLVED_STATUSES.has(t.status)
  );
  const overdueIds = new Set(overdue.map(t => t.id));

  const slaRisk = tickets.filter(t =>
    !overdueIds.has(t.id) &&
    t.dueDate.getTime() >= overdueThreshold &&
    t.dueDate.getTime() <= slaThreshold &&
    !RESOLVED_STATUSES.has(t.status)
  );
  const slaRiskIds = new Set(slaRisk.map(t => t.id));

  const highPriorityOpen = tickets.filter(t =>
    !overdueIds.has(t.id) &&
    !slaRiskIds.has(t.id) &&
    !RESOLVED_STATUSES.has(t.status) &&
    (t.priority === "high" || t.priority === "urgent")
  );

  return {
    overdue: sortTickets(overdue),
    slaRisk: sortTickets(slaRisk),
    highPriorityOpen: sortTickets(highPriorityOpen)
  };
}

const dummyTickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TKT-001",
    customerName: "John Smith",
    device: "MacBook Pro 2021 14\"",
    issue: "Screen flicker and no display output",
    status: "delivered",
    priority: "high",
    createdAt: new Date("2024-01-05"),
    dueDate: new Date("2024-01-10"),
    assignedTechnician: "Mike Chen",
    estimatedCost: 450,
    paidAmount: 450
  },
  {
    id: "2",
    ticketNo: "TKT-002",
    customerName: "Sarah Johnson",
    device: "iPhone 14 Pro",
    issue: "Cracked screen and battery draining fast",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2024-01-08"),
    dueDate: new Date(Date.now() - 86400000),
    assignedTechnician: "Lisa Wong",
    estimatedCost: 280,
    paidAmount: 100
  },
  {
    id: "3",
    ticketNo: "TKT-003",
    customerName: "Bob Wilson",
    device: "Dell XPS 15",
    issue: "Keyboard not responding, liquid spill damage",
    status: "waiting_approval",
    priority: "high",
    createdAt: new Date("2024-01-10"),
    dueDate: new Date(Date.now() - 43200000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 320,
    paidAmount: 0
  },
  {
    id: "4",
    ticketNo: "TKT-004",
    customerName: "Emily Davis",
    device: "Samsung Galaxy S23",
    issue: "Won't charge, possible charging port damage",
    status: "diagnosing",
    priority: "normal",
    createdAt: new Date("2024-01-12"),
    dueDate: new Date(Date.now() + 7200000),
    assignedTechnician: null,
    estimatedCost: 85,
    paidAmount: 0
  },
  {
    id: "5",
    ticketNo: "TKT-005",
    customerName: "Michael Brown",
    device: "iPad Air 5",
    issue: "Touchscreen unresponsive in lower half",
    status: "new",
    priority: "normal",
    createdAt: new Date("2024-01-13"),
    dueDate: new Date(Date.now() + 3600000),
    assignedTechnician: null,
    estimatedCost: 150,
    paidAmount: 0
  },
  {
    id: "6",
    ticketNo: "TKT-006",
    customerName: "Lisa Anderson",
    device: "ASUS ROG Laptop",
    issue: "Blue screen on boot, RAM issues suspected",
    status: "repairing",
    priority: "urgent",
    createdAt: new Date("2024-01-06"),
    dueDate: new Date(Date.now() - 172800000),
    assignedTechnician: "Tom Harris",
    estimatedCost: 550,
    paidAmount: 200
  },
  {
    id: "7",
    ticketNo: "TKT-007",
    customerName: "David Lee",
    device: "PlayStation 5",
    issue: "No video output, HDMI port damage",
    status: "ready",
    priority: "high",
    createdAt: new Date("2024-01-04"),
    dueDate: new Date(Date.now() + 86400000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 180,
    paidAmount: 180
  },
  {
    id: "8",
    ticketNo: "TKT-008",
    customerName: "Jennifer Martinez",
    device: "Surface Pro 9",
    issue: "Battery swelling, device won't close",
    status: "cancelled",
    priority: "low",
    createdAt: new Date("2024-01-03"),
    dueDate: new Date("2024-01-15"),
    assignedTechnician: null,
    estimatedCost: 200,
    paidAmount: 0
  },
  {
    id: "9",
    ticketNo: "TKT-009",
    customerName: "Robert Taylor",
    device: "Nintendo Switch OLED",
    issue: "Joy-Con drift and screen burn-in",
    status: "diagnosing",
    priority: "low",
    createdAt: new Date("2024-01-14"),
    dueDate: new Date(Date.now() + 43200000),
    assignedTechnician: "Lisa Wong",
    estimatedCost: 75,
    paidAmount: 0
  },
  {
    id: "10",
    ticketNo: "TKT-010",
    customerName: "Amanda White",
    device: "HP Envy all-in-one PC",
    issue: "Virus/malware infection, system extremely slow",
    status: "repairing",
    priority: "high",
    createdAt: new Date("2024-01-11"),
    dueDate: new Date(Date.now() + 7200000),
    assignedTechnician: "Tom Harris",
    estimatedCost: 120,
    paidAmount: 60
  },
  {
    id: "11",
    ticketNo: "TKT-011",
    customerName: "Chris Thompson",
    device: "Google Pixel 8",
    issue: "Camera app crashes, lens scratch",
    status: "new",
    priority: "normal",
    createdAt: new Date("2024-01-15"),
    dueDate: new Date(Date.now() + 172800000),
    assignedTechnician: null,
    estimatedCost: 95,
    paidAmount: 0
  },
  {
    id: "12",
    ticketNo: "TKT-012",
    customerName: "Nancy Garcia",
    device: "ThinkPad X1 Carbon",
    issue: "BIOS corruption, won't post",
    status: "waiting_approval",
    priority: "urgent",
    createdAt: new Date("2024-01-07"),
    dueDate: new Date(Date.now() - 259200000),
    assignedTechnician: "Mike Chen",
    estimatedCost: 380,
    paidAmount: 100
  }
];

if (require.main === module) {
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
  const overdue = getOverdueTickets(dummyTickets);
  console.log(`Found ${overdue.length} overdue ticket(s)`);
  overdue.forEach(t => console.log(`  ${t.ticketNo} - ${t.device} (due: ${t.dueDate.toLocaleDateString()}, ${t.priority})`));

  console.log("\n=== SLA Risk Tickets (24h) ===");
  const slaRisk = getSLARiskTickets(dummyTickets);
  console.log(`Found ${slaRisk.length} at-risk ticket(s)`);
  slaRisk.forEach(t => console.log(`  ${t.ticketNo} - ${t.device} (due: ${t.dueDate.toLocaleDateString()}, ${t.priority})`));

  console.log("\n=== Urgent Queue ===");
  const urgentQueue = getUrgentQueue(dummyTickets);
  console.log(`Overdue: ${urgentQueue.overdue.length}`);
  urgentQueue.overdue.forEach(t => console.log(`  - ${t.ticketNo}: ${t.device}`));
  console.log(`SLA Risk: ${urgentQueue.slaRisk.length}`);
  urgentQueue.slaRisk.forEach(t => console.log(`  - ${t.ticketNo}: ${t.device}`));
  console.log(`High Priority Open: ${urgentQueue.highPriorityOpen.length}`);
  urgentQueue.highPriorityOpen.forEach(t => console.log(`  - ${t.ticketNo}: ${t.device} (${t.priority})`));
}