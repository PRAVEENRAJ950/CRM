import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../auth/authService";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password, "customer")) {
      navigate("/dashboard");
    } else {
      alert("Invalid Customer credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Customer Login</h2>

        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button>Login</button>

        <p>
          <Link to="/create-account">Create Account</Link>|{" "}
          <Link to="/manager-login">Manager Login</Link>
          </p>
      </form>
    </div>
  );
};

export default CustomerLogin;
