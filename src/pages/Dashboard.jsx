import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import CustomersTable from "../components/CustomersTable";

const Dashboard = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardCards />
        <CustomersTable />
      </div>
    </div>
  );
};

export default Dashboard;
