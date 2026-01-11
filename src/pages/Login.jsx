import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../auth/fakeAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = loginUser(email, password);

    if (user) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
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
          Customer → customer@test.com  
          <br />
          Manager → manager@test.com  
          <br />
          Password → 123456
        </p>
      </form>
    </div>
  );
};

export default Login;
