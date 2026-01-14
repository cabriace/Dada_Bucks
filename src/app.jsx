import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Parent Pages */
import ParentLayout from "./parent/ParentLayout";
import Home from "./parent/Home";
import Earn from "./parent/Earn";
import Requests from "./parent/Requests";
import Settings from "./parent/Settings";

/* Auth Pages (example placeholders) */
import Login from "./auth/Login";
import Signup from "./auth/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PARENT ROUTES */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="earn" element={<Earn />} />
          <Route path="requests" element={<Requests />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
