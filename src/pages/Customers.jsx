import React, { useEffect, useState } from "react"; 
import CustomersTable from "../components/CustomersTable.jsx";


const Customers = () => {
  const [customers, setCustomers] = useState([]); 

  useEffect(() => {
    setCustomers([
      {
        id: "1",
        name: "Alice Johnson",
        company: "Acme Corp",
        email: "alice@example.com",
        phone: "+1 555 111 2222",
        source: "Website",
        role: "customer",
      },
      {
        id: "2",
        name: "Bob Smith",
        company: "Globex",
        email: "bob@example.com",
        phone: "+1 555 333 4444",
        source: "Referral",
        role: "customer",
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
        View and manage accounts using the CRM.
      </p>
      <CustomersTable customers={customers} />
    </div>
  );
};


export default Customers;

