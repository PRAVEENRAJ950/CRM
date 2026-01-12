import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Settings = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Settings" />

        <div className="card">
          <h3>Organization Settings</h3>
          <p>Company Name: ABC Technologies</p>
          <p>Timezone: IST</p>
          <p>Currency: INR</p>
        </div>

        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Security</h3>
          <p>Role-Based Access Enabled</p>
          <p>Password Policy Active</p>
        </div>

      </div>
    </div>
  );
};

export default Settings;
