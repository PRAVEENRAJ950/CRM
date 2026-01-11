export const users = [
  {
    email: "customer@test.com",
    password: "123456",
    role: "customer",
  },
  {
    email: "manager@test.com",
    password: "123456",
    role: "manager",
  },
];

export const loginUser = (email, password) => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }

  return null;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
