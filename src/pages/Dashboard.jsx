import React from "react"; 
import DashboardCards from "../components/DashboardCards.jsx"; 


const Dashboard = () => {
  return (
    <div>
      <h1 className="page-title">Welcome back</h1>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Here's a quick overview of your CRM performance today.
      </p>
      <DashboardCards />
    </div>
  );
};


export default Dashboard;

