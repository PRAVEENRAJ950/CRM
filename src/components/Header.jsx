import React from "react";
import { useLocation } from "react-router-dom";


const TITLE_MAP = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/leads": "Leads",
  "/deals": "Deals",
  "/activities": "Activities",
  "/reports": "Reports",
  "/settings": "Settings",
  "/users": "Users",
};


const Header = () => {
  const location = useLocation(); 
  const title = TITLE_MAP[location.pathname] || "CRM";

  return (
    <header
      style={{
        height: "56px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
      }}
    >
      {/* Current page title */}
      <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{title}</div>

      {/* Right side placeholder (could show user, notifications, etc.) */}
      <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Logged in</div>
    </header>
  );
};


export default Header;

