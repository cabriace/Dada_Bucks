import { Storage } from "./storage.js";
import { Transaction, SpendRequest } from "./models.js";

/* =========================
   STRIKE MANAGER
========================= */
export const StrikeManager = {
  get() {
    return Storage.get("strikes", 0);
  },

  add() {
    const strikes = this.get();
    if (strikes < 3) {
      Storage.set("strikes", strikes + 1);
    }
  },

  resetDaily() {
    Storage.set("strikes", 0);
  },

  isLocked() {
    return this.get() >= 3;
  }
};

/* =========================
   ECONOMY MANAGER
========================= */
export const EconomyManager = {
  getVault() {
    return Storage.get("vault", 1000);
  },

  setVault(value) {
    Storage.set("vault", Math.min(value, 1000));
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

/* =========================
   TRANSACTION MANAGER
========================= */
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

/* =========================
   TASK MANAGER
========================= */
export const TaskManager = {
  getProgress() {
    return Storage.get("tasks", {});
  },

  complete(task) {
    if (StrikeManager.isLocked()) return false;

    const progress = this.getProgress();
    const completed = progress[task.id] ?? 0;

    if (completed >= task.max) return false;

    progress[task.id] = completed + 1;
    Storage.set("tasks", progress);

    EconomyManager.earn(task.payout, task.name);
    return true;
  }
};

/* =========================
   SPEND REQUEST MANAGER
========================= */
export const SpendRequestManager = {
  getAll() {
    return Storage.get("requests", []);
  },

  create(items, total) {
    const request = new SpendRequest(items, total);
    const all = this.getAll();
    all.push(request);
    Storage.set("requests", all);
  },

  update(id, status) {
    const updated = this.getAll().map(r =>
      r.id === id ? { ...r, status } : r
    );
    Storage.set("requests", updated);
  }
};
