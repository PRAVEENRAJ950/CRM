import React from "react"; 
import { NavLink, useNavigate } from "react-router-dom"; 
import { clearToken } from "../auth/authService.js"; 


const Sidebar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    clearToken();
    navigate("/manager-login");
  };

  return (
    <aside
      style={{
        backgroundColor: "#111827",
        color: "#e5e7eb",
        padding: "1.25rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* App brand / logo */}
      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
        CRM Dashboard
      </div>

      {/* Navigation links to main CRM sections */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          flexGrow: 1,
        }}
      >
        <SidebarLink to="/dashboard" label="Dashboard" />
        <SidebarLink to="/customers" label="Customers" />
        <SidebarLink to="/leads" label="Leads" />
        <SidebarLink to="/deals" label="Deals" />
        <SidebarLink to="/activities" label="Activities" />
        <SidebarLink to="/reports" label="Reports" />
        <SidebarLink to="/users" label="Users" />
        <SidebarLink to="/settings" label="Settings" />
      </nav>

      {/* Logout button at the bottom */}
      <button className="btn btn-secondary" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};


const SidebarLink = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "0.4rem 0.6rem",
        borderRadius: "0.5rem",
        fontSize: "0.9rem",
        backgroundColor: isActive ? "#1f2937" : "transparent",
        color: "#e5e7eb",
      })}
    >
      {label}
    </NavLink>
  );
};


export default Sidebar;

