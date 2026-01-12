import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Reports = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Reports" />

        <div className="cards">
          <div className="card">
            <h3>Sales Performance</h3>
            <p>₹2.3L</p>
          </div>
          <div className="card">
            <h3>Lead Conversion</h3>
            <p>26%</p>
          </div>
          <div className="card">
            <h3>Deals Closed</h3>
            <p>85</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
