import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Users = () => {
  const users = [
    { email: "admin@test.com", role: "Admin" },
    { email: "manager@test.com", role: "Manager" },
    { email: "sales@test.com", role: "Sales Executive" },
  ];

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title="User Management" />

        <div className="table-container">
          <h2>Users</h2>

          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Users;
