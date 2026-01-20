import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth/authService.js";


const CustomerLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
     
      await login({ email, password, role: "customer" });
      
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
        <div className="auth-title">Customer Login</div>
        <div className="auth-subtitle">Sign in to access your CRM portal.</div>

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
          Manager?{" "}
          <Link className="text-link" to="/manager-login">
            Go to manager login
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


export default CustomerLogin;

