import { Routes, Route, Navigate } from "react-router-dom";

import CustomerLogin from "./pages/CustomerLogin";
import ManagerLogin from "./pages/ManagerLogin";
import CreateAccount from "./pages/CreateAccount";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { getUser } from "./auth/authService";

/* 🔐 Protect dashboard & CRM pages */
const PrivateRoute = ({ children }) => {
  const user = getUser();
  return user ? children : <Navigate to="/customer-login" replace />;
};

function App() {
  return (
    <Routes>

      {/* ===== LOGIN PAGES ===== */}
      <Route path="/" element={<Navigate to="/customer-login" />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/create-account" element={<CreateAccount />} />

      {/* ===== PROTECTED CRM AREA ===== */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/customer-login" />} />

    </Routes>
  );
}

export default App;
