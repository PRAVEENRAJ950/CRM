import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth/authService";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    register(email, password, role);
    alert("Account Created Successfully");
    navigate(role === "customer" ? "/customer-login" : "/manager-login");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <select onChange={e => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="manager">Manager</option>
        </select>

        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button>Create</button>
      </form>
    </div>
  );
};

export default CreateAccount;
