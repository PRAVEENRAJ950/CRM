import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";


const Layout = () => {
  return (
    <div className="layout">
      {/* Left navigation area */}
      <Sidebar />

      {/* Right side: header + page content */}
      <div className="layout-main">
        <Header />
        <main className="layout-content">
          {/* Nested routes will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default Layout;

