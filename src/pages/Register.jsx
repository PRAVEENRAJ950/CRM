import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register:", { role, email, password });
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Create Account</h2>

      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="manager">Manager</option>
        </select>
      </label>

      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <br />
      <button type="submit">Create Account</button>
    </form>
  );
}
