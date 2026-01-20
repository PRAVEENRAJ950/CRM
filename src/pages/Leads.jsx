import React, { useEffect, useState } from "react"; 
import { apiGet, apiPost } from "../auth/authService.js";

const Leads = () => {
  const [leads, setLeads] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const [form, setForm] = useState({
    company: "",
    source: "",
    status: "new",
  }); 

  
  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/leads");
      setLeads(data);
    } catch (err) {
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiPost("/leads", form);
      setForm({ company: "", source: "", status: "new" });
      loadLeads();
    } catch (err) {
      setError(err.message || "Failed to create lead");
    }
  };

  return (
    <div>
      <h1 className="page-title">Leads</h1>
      <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Track potential customers and their current status.
      </p>

      {error && <div className="error-banner">{error}</div>}

      {/* Simple form to create a new lead */}
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
          <label className="form-label">Company</label>
          <input
            name="company"
            className="form-input"
            value={form.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Source</label>
          <input
            name="source"
            className="form-input"
            value={form.source}
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          Add lead
        </button>
      </form>

      {/* List of leads from backend */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                  Loading leads...
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                  No leads yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.company}</td>
                <td>{lead.source}</td>
                <td>{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;

