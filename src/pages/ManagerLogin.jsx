import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth/authService.js";

const ManagerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Attempt login with role "manager"
      await login({ email, password, role: "manager" });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">Manager Login</div>
        <div className="auth-subtitle">Sign in to manage customers, leads, and deals.</div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: "1rem" }} className="text-muted">
          Customer?{" "}
          <Link className="text-link" to="/customer-login">
            Go to customer login
          </Link>
        </p>

        <p className="text-muted">
          New user?{" "}
          <Link className="text-link" to="/create-account">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ManagerLogin;

