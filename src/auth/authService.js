const users = [
  {
    name: "Default Manager",
    company: "CRM Corp",
    email: "manager@test.com",
    phone: "9999999999",
    source: "Internal",
    password: "123456",
    role: "manager",
  },
  {
    name: "Default customer",
    company: "-",
    email: "customer@test.com",
    phone: "1111111111",
    source: "Internal",
    password: "123456",
    role: "customer",
  }
];

export const register = (userData) => {
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export const login = (email, password, role) => {
  const storedUsers = JSON.parse(localStorage.getItem("users")) || users;

  const user = storedUsers.find(
    (u) => u.email === email && u.password === password && u.role === role
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
