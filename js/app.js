import { render } from "./ui.js";

const a = Math.floor(Math.random() * 10);
const b = Math.floor(Math.random() * 10);
const answer = a + b;

document.getElementById("math-question").innerText =
  `${a} + ${b} = ?`;

window.unlock = () => {
  const val = Number(document.getElementById("math-input").value);
  if (val === answer) {
    document.getElementById("math-lock").style.display = "none";
  } else {
    alert("Try again!");
  }
};

render();
