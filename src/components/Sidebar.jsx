const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">CRM</h2>
      <ul>
        <li className="active">Dashboard</li>
        <li>Customers</li>
        <li>Leads</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
