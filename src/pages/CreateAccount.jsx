import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth/authService";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
    alert("Account Created Successfully");
    navigate(
      form.role === "manager" ? "/manager-login" : "/customer-login"
    );
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Company Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <select name="source" onChange={handleChange}>
          <option>Website</option>
          <option>Referral</option>
          <option>Campaign</option>
          <option>Social Media</option>
        </select>

        <select name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="manager">Manager</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;
