import React from "react";
const Users = () => {
  const users = [
    { id: 1, name: "Jane Manager", role: "manager", email: "jane.manager@example.com" },
    { id: 2, name: "John Admin", role: "admin", email: "john.admin@example.com" },
    { id: 3, name: "Carrie Customer", role: "customer", email: "carrie.customer@example.com" },
  ];

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
        View example users in this workspace.
      </p>

      <div className="table-wrapper" style={{ maxWidth: "640px" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Users;

