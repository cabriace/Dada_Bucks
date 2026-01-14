import { Tasks } from "./models.js";
import { TaskManager, StrikeManager, EconomyManager } from "./managers.js";
import { getProfile } from "./profile.js";

export async function render() {
  const profile = await getProfile();

  document.getElementById("role").innerText =
    `Role: ${profile.role || "unset"}`;

  document.getElementById("balance").innerText =
    profile.balance + " DB";

  renderStrikes(profile.strikes);
  renderTasks(profile.role);
}

function renderStrikes(strikes) {
  const el = document.getElementById("strikes");
  el.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    el.innerHTML += `<span class="strike ${i < strikes ? "on" : ""}">⚡</span>`;
  }
}

function renderTasks(role) {
  const el = document.getElementById("tasks");
  el.innerHTML = "";

  if (role !== "child") {
    el.innerHTML = "<p>Only children can complete tasks.</p>";
    return;
  }

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
