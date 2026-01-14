export class Task {
  constructor(id, name, payout, dailyMax) {
    this.id = id;
    this.name = name;
    this.payout = payout;
    this.dailyMax = dailyMax;
    this.completedToday = 0;
  }
}

export class Transaction {
  constructor(amount, label) {
    this.id = crypto.randomUUID();
    this.amount = amount;
    this.label = label;
    this.timestamp = new Date().toISOString();
  }
}

export class SpendRequest {
  constructor(items, total) {
    this.id = crypto.randomUUID();
    this.items = items;
    this.total = total;
    this.status = "pending";
    this.timestamp = new Date().toISOString();
  }
}
export const Tasks = [
  { id: 1, name: "Clean up", payout: 2, max: 5 },
  { id: 2, name: "Make bed", payout: 3, max: 1 },
  { id: 3, name: "Read page", payout: 3, max: 7 },
  { id: 4, name: "Brush teeth", payout: 5, max: 2 }
];
