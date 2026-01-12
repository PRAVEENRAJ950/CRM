import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Leads = () => {
  const leads = [
    { name: "ABC Corp", source: "Website", status: "New" },
    { name: "XYZ Ltd", source: "Referral", status: "Qualified" },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Leads" />

        <div className="table-container">
          <h2>Lead Management</h2>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={i}>
                  <td>{l.name}</td>
                  <td>{l.source}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Leads;
