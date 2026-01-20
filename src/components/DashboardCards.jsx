import React from "react"; 

const DashboardCards = () => {
 
  const items = [
    { label: "Total Customers", value: "128" },
    { label: "Open Leads", value: "34" },
    { label: "Active Deals", value: "18" },
    { label: "Activities Today", value: "9" },
  ];

  return (
    <div className="cards-grid">
      {items.map((item) => (
        <div key={item.label} className="card">
          <div className="card-title">{item.label}</div>
          <div className="card-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};


export default DashboardCards;

