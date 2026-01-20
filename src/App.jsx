import React from "react"; 
import { Routes, Route, Navigate } from "react-router-dom"; 

import PrivateRoute from "./auth/PrivateRoute.jsx"; 
import CustomerLogin from "./pages/CustomerLogin.jsx"; 
import ManagerLogin from "./pages/ManagerLogin.jsx"; 
import CreateAccount from "./pages/CreateAccount.jsx"; 

import Layout from "./components/Layout.jsx"; 
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Leads from "./pages/Leads.jsx";
import Deals from "./pages/Deals.jsx";
import Activities from "./pages/Activities.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Users from "./pages/Users.jsx";

// App component wires all routes together
const App = () => {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/create-account" element={<CreateAccount />} />

      {/* Protected CRM routes */}
      <Route element={<PrivateRoute />}>
        {/* All routes below share the CRM layout (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>

      {/* Default route redirects to manager login if no path matches */}
      <Route path="*" element={<Navigate to="/manager-login" replace />} />
    </Routes>
  );
};


export default App;

