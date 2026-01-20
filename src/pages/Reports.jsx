import React from "react"; 

const Reports = () => {
  return (
    <div>
      <h1 className="page-title">Reports</h1>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
        High-level analytics and performance insights will appear here.
      </p>

      <div className="cards-grid">
        <div className="card">
          <div className="card-title">Conversion rate</div>
          <div className="card-value">32%</div>
        </div>
        <div className="card">
          <div className="card-title">Average deal size</div>
          <div className="card-value">$5.2k</div>
        </div>
        <div className="card">
          <div className="card-title">Cycle length</div>
          <div className="card-value">21 days</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

