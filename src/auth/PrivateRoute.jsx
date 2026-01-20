import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./authService.js";

const PrivateRoute = () => {
  
  const token = getToken();

  if (!token) {
    return <Navigate to="/manager-login" replace />;
  }
  return <Outlet />;
};
export default PrivateRoute;

