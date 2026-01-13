import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Activities = () => {
  const activities = [
    {
      type: "Call",
      description: "Call Arun Kumar regarding proposal",
      dueDate: "Today",
      status: "Pending",
    },
    {
      type: "Meeting",
      description: "Project discussion with John",
      dueDate: "Tomorrow",
      status: "Completed",
    },
    {
      type: "Email",
      description: "Follow-up email to Sneha",
      dueDate: "Today",
      status: "Pending",
    },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <Header title="Activities & Tasks" />

        <div className="table-container">
          <h2>Scheduled Activities</h2>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.type}</td>
                  <td>{activity.description}</td>
                  <td>{activity.dueDate}</td>
                  <td
                    className={
                      activity.status === "Completed"
                        ? "active-status"
                        : "inactive-status"
                    }
                  >
                    {activity.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Activities;
