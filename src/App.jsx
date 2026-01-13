import { Routes, Route, Navigate } from "react-router-dom";

/* ===== AUTH PAGES ===== */
import CustomerLogin from "./pages/CustomerLogin";
import ManagerLogin from "./pages/ManagerLogin";
import CreateAccount from "./pages/CreateAccount";

/* ===== CRM PAGES ===== */
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

/* ===== AUTH SERVICE ===== */
import { getUser } from "./auth/authService";

/* ===== PROTECTED ROUTE ===== */
const PrivateRoute = ({ children }) => {
  const user = getUser();
  return user ? children : <Navigate to="/customer-login" replace />;
};

function App() {
  return (
    <Routes>

      {/* ===== DEFAULT ROUTE ===== */}
      <Route path="/" element={<Navigate to="/customer-login" replace />} />

      {/* ===== LOGIN ROUTES ===== */}
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/create-account" element={<CreateAccount />} />

      {/* ===== PROTECTED CRM ROUTES ===== */}
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
        path="/deals"
        element={
          <PrivateRoute>
            <Deals />
          </PrivateRoute>
        }
      />

      <Route
        path="/activities"
        element={
          <PrivateRoute>
            <Activities />
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

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/customer-login" replace />} />

    </Routes>
  );
}

export default App;
