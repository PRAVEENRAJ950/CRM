import React, { useEffect, useState } from "react"; 
import { apiGet, apiPost } from "../auth/authService.js"; 

const Deals = () => {
  const [deals, setDeals] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    dealName: "",
    stage: "prospecting",
    value: "",
  }); 

  
  const loadDeals = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/deals");
      setDeals(data);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiPost("/deals", {
        ...form,
        value: Number(form.value || 0),
      });
      setForm({ dealName: "", stage: "prospecting", value: "" });
      loadDeals();
    } catch (err) {
      setError(err.message || "Failed to create deal");
    }
  };

  return (
    <div>
      <h1 className="page-title">Deals</h1>
      <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Manage your pipeline and track deal stages.
      </p>

      {error && <div className="error-banner">{error}</div>}

      {/* Simple form to create a new deal */}
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
          <label className="form-label">Deal name</label>
          <input
            name="dealName"
            className="form-input"
            value={form.dealName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Stage</label>
          <select
            name="stage"
            className="form-select"
            value={form.stage}
            onChange={handleChange}
            required
          >
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed won</option>
            <option value="closed-lost">Closed lost</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Value</label>
          <input
            type="number"
            name="value"
            className="form-input"
            value={form.value}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Add deal
        </button>
      </form>

      {/* Deals table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Stage</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                  Loading deals...
                </td>
              </tr>
            )}
            {!loading && deals.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                  No deals yet.
                </td>
              </tr>
            )}
            {deals.map((deal) => (
              <tr key={deal._id}>
                <td>{deal.dealName}</td>
                <td>{deal.stage}</td>
                <td>${deal.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Deals;

