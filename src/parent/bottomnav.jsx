import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#111",
    color: "#fff",
    borderTop: "1px solid #333",
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#4CAF50" : "#aaa",
    textDecoration: "none",
    fontSize: "14px",
  });

  return (
    <nav style={navStyle}>
      <NavLink to="/parent/home" style={linkStyle}>Home</NavLink>
      <NavLink to="/parent/earn" style={linkStyle}>Earn</NavLink>
      <NavLink to="/parent/requests" style={linkStyle}>Requests</NavLink>
      <NavLink to="/parent/settings" style={linkStyle}>Settings</NavLink>
    </nav>
  );
}
