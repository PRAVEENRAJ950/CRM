import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Deals = () => {
  const deals = [
    { name: "CRM Project", stage: "Proposal", value: "₹50,000" },
    { name: "Website Revamp", stage: "Negotiation", value: "₹80,000" },
  ];

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title="Deals" />

        <div className="table-container">
          <h2>Deals Pipeline</h2>

          <table>
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Stage</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal, index) => (
                <tr key={index}>
                  <td>{deal.name}</td>
                  <td>{deal.stage}</td>
                  <td>{deal.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Deals;
