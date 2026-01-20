import React, { useEffect, useState } from "react"; 
import { apiGet, apiPost } from "../auth/authService.js"; 

const Activities = () => {
  const [activities, setActivities] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [form, setForm] = useState({
    type: "call",
    description: "",
    dueDate: "",
    status: "pending",
  }); 

 
  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/activities");
      setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiPost("/activities", form);
      setForm({
        type: "call",
        description: "",
        dueDate: "",
        status: "pending",
      });
      loadActivities();
    } catch (err) {
      setError(err.message || "Failed to create activity");
    }
  };

  return (
    <div>
      <h1 className="page-title">Activities</h1>
      <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Plan and track calls, emails, and follow-ups.
      </p>

      {error && <div className="error-banner">{error}</div>}

      {/* Simple form to create a new activity */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem",
          alignItems: "end",
        }}
      >
        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            name="description"
            className="form-input"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due date</label>
          <input
            type="date"
            name="dueDate"
            className="form-input"
            value={form.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          Add activity
        </button>
      </form>

      {/* Activities table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" style={{ padding: "1rem", textAlign: "center" }}>
                  Loading activities...
                </td>
              </tr>
            )}
            {!loading && activities.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: "1rem", textAlign: "center" }}>
                  No activities yet.
                </td>
              </tr>
            )}
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.type}</td>
                <td>{activity.description}</td>
                <td>{activity.dueDate ? activity.dueDate.slice(0, 10) : ""}</td>
                <td>{activity.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Activities;

