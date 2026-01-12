import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Customers = () => {
  const customers = [
    { name: "Arun Kumar", email: "arun@gmail.com", country: "India" },
    { name: "John Smith", email: "john@gmail.com", country: "USA" },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Customers" />

        <div className="table-container">
          <h2>Customer List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Customers;
