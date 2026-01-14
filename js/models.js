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
