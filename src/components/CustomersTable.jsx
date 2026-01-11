const CustomersTable = () => {
  return (
    <div className="table-container">
      <h2>Recent Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Arun Kumar</td>
            <td>arun@gmail.com</td>
            <td className="active-status">Active</td>
            <td>India</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>john@gmail.com</td>
            <td className="inactive-status">Inactive</td>
            <td>USA</td>
          </tr>
          <tr>
            <td>Sneha</td>
            <td>sneha@gmail.com</td>
            <td className="active-status">Active</td>
            <td>India</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
