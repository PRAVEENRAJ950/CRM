import React from "react"; 

const Settings = () => {
  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Update your profile information and workspace preferences.
      </p>

      <div
        className="card"
        style={{ maxWidth: "520px", marginBottom: "1rem" }}
      >
        <div className="card-title">Profile</div>
        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          In a production app, this is where you would edit your name, email, and
          notification settings.
        </p>
      </div>

      <div
        className="card"
        style={{ maxWidth: "520px" }}
      >
        <div className="card-title">Workspace</div>
        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          Configure CRM defaults such as currency, time zone, and pipeline stages.
        </p>
      </div>
    </div>
  );
};

export default Settings;

