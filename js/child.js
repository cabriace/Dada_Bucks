import { EconomyManager, SpendRequestManager } from "./managers.js";

document.getElementById("balance").innerText =
  EconomyManager.getBalance();

window.requestSpend = () => {
  SpendRequestManager.create(
    [{ name: "Watch Movie", cost: 40 }],
    40
  );
  alert("Request sent to parent!");
};
