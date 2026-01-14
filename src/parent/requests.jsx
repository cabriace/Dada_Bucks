export default function Requests() {
  const requests = [
    { id: 1, child: "Ava", amount: 20, reason: "Snacks" },
    { id: 2, child: "Leo", amount: 15, reason: "Toy" },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h2>Requests</h2>

      {requests.map(req => (
        <div key={req.id} className="card">
          <h4>{req.child}</h4>
          <p>{req.amount} DB — {req.reason}</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "green", color: "white" }}>
              Accept
            </button>
            <button style={{ background: "gray", color: "white" }}>
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
