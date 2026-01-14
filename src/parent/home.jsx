export default function Home() {
  const children = [
    { id: 1, name: "Ava", balance: 120, todayEarned: 15, strikes: 1 },
    { id: 2, name: "Leo", balance: 80, todayEarned: 10, strikes: 0 },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h2>Vault Balance</h2>
      <div className="card">
        <h1>850 / 1000 DB</h1>
        <progress value="850" max="1000" style={{ width: "100%" }} />
      </div>

      <h3>Children</h3>
      {children.map(child => (
        <div key={child.id} className="card">
          <h4>{child.name}</h4>
          <p>Balance: {child.balance} DB</p>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>💰 +{child.todayEarned}</span>
            <span>⚠️ {child.strikes}</span>
          </div>

          <button
            style={{
              marginTop: "10px",
              background: "red",
              color: "white",
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            ADD STRIKE
          </button>
        </div>
      ))}

      <h3>Pending Requests</h3>
      <div className="card">
        <p>Ava — 20 DB (Snacks)</p>
      </div>
    </div>
  );
}
