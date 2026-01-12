import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../auth/authService";

const ManagerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const success = login(email, password, "manager");

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid Manager credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Manager Login</h2>

        <input
          type="email"
          placeholder="Manager Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p style={{ marginTop: "10px" }}>
          <Link to="/customer-login">Customer Login</Link> |{" "}
          <Link to="/create-account">Create Account</Link>
        </p>
      </form>
    </div>
  );
};

export default ManagerLogin;
