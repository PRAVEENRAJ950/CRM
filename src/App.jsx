import { Routes, Route, Link } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin";
import ManagerLogin from "./pages/ManagerLogin";
import Register from "./pages/Register";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <nav>
        <Link to="/customer">Customer Login</Link> |{" "}
        <Link to="/manager">Manager Login</Link> |{" "}
        <Link to="/register">Create Account</Link>
      </nav>

      <Routes>
        <Route path="/customer" element={<CustomerLogin />} />
        <Route path="/manager" element={<ManagerLogin />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
