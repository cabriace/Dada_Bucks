import { Tasks } from "./models.js";
import { TaskManager, StrikeManager, EconomyManager } from "./managers.js";

export function render() {
  document.getElementById("balance").innerText =
    EconomyManager.getBalance() + " DB";

  renderStrikes();
  renderTasks();
}

function renderStrikes() {
  const strikes = StrikeManager.get();
  const el = document.getElementById("strikes");
  el.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    el.innerHTML += `<span class="strike ${i < strikes ? "on" : ""}">⚡</span>`;
  }
}

function renderTasks() {
  const el = document.getElementById("tasks");
  el.innerHTML = "";
  Tasks.forEach(t => {
    el.innerHTML += `
      <div class="card">
        <h3>${t.name}</h3>
        <p>${t.payout} DB</p>
        <button onclick="completeTask(${t.id})">+</button>
      </div>
    `;
  });
}

window.completeTask = id => {
  const task = Tasks.find(t => t.id === id);
  if (!TaskManager.complete(task)) {
    alert("Task locked or maxed");
  }
  render();
};
