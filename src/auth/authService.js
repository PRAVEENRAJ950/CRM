const users = [
  { email: "customer@test.com", password: "123456", role: "customer" },
  { email: "manager@test.com", password: "123456", role: "manager" }
];

export const login = (email, password, role) => {
  const user = users.find(
    u => u.email === email && u.password === password && u.role === role
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  }
  return false;
};

export const register = (email, password, role) => {
  users.push({ email, password, role });
  return true;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
