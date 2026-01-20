import React from "react";

const CustomersTable = ({ customers }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: "1rem", textAlign: "center" }}>
                No customers found.
              </td>
            </tr>
          )}
          {customers.map((c) => (
            <tr key={c.id || c.email}>
              <td>{c.name}</td>
              <td>{c.company}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.source}</td>
              <td>{c.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


CustomersTable.defaultProps = {
  customers: [],
};


export default CustomersTable;

