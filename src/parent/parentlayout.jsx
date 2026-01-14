import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function ParentLayout() {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <Outlet />
      <BottomNav />
    </div>
  );
}
