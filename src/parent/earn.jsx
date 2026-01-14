import { useState } from "react";

export default function Earn() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Clean Room", payout: 5, count: 0 },
    { id: 2, name: "Homework", payout: 10, count: 0 },
  ]);

  const updateCount = (id, delta) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, count: Math.max(0, task.count + delta) }
        : task
    ));
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Task Tracker</h2>

      {tasks.map(task => (
        <div key={task.id} className="card">
          <h4>{task.name}</h4>
          <p>{task.payout} DB each</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => updateCount(task.id, 1)}>➕</button>
            <button onClick={() => updateCount(task.id, -1)}>➖</button>
            <span>Completed: {task.count}</span>
          </div>
        </div>
      ))}

      <button
        style={{
          position: "fixed",
          bottom: "80px",
          left: "16px",
          right: "16px",
          padding: "16px",
          fontSize: "18px",
          background: "#4CAF50",
          color: "white",
          borderRadius: "12px",
        }}
      >
        Submit Payment
      </button>
    </div>
  );
}
