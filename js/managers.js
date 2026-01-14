import { Storage } from "./storage.js";
import { Transaction, SpendRequest } from "./models.js";

export const StrikeManager = {
  getStrikes() {
    return Storage.get("strikes", 0);
  },
  addStrike() {
    let strikes = this.getStrikes();
    if (strikes < 3) Storage.set("strikes", strikes + 1);
  },
  isLocked() {
    return this.getStrikes() >= 3;
  },
  resetDaily() {
    Storage.set("strikes", 0);
  }
};

export const EconomyManager = {
  getVault() {
    return Storage.get("vault", 1000);
  },
  setVault(val) {
    Storage.set("vault", Math.min(val, 1000));
  },
  getBalance() {
    return Storage.get("balance", 0);
  },
  earn(amount, label) {
    if (StrikeManager.isLocked()) return;
    this.setVault(this.getVault() - amount);
    Storage.set("balance", this.getBalance() + amount);
    TransactionManager.add(amount, label);
  },
  spend(amount, label) {
    Storage.set("balance", this.getBalance() - amount);
    this.setVault(this.getVault() + amount);
    TransactionManager.add(-amount, label);
  }
};

export const TransactionManager = {
  getAll() {
    return Storage.get("transactions", []);
  },
  add(amount, label) {
    const tx = new Transaction(amount, label);
    const all = this.getAll();
    all.unshift(tx);
    Storage.set("transactions", all);
  }
};

export const SpendRequestManager = {
  getAll() {
    return Storage.get("requests", []);
  },
  create(items, total) {
    const req = new SpendRequest(items, total);
    const all = this.getAll();
    all.push(req);
    Storage.set("requests", all);
  },
  update(id, status) {
    const all = this.getAll().map(r =>
      r.id === id ? { ...r, status } : r
    );
    Storage.set("requests", all);
  }
};
