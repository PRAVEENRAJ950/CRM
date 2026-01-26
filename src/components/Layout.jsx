/**
 * Layout Component
 * Main layout wrapper with Sidebar and Header
 */

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Layout Component
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.setUser - Function to update user state
 * @param {React.ReactNode} props.children - Page content to render
 */
const Layout = ({ user, setUser, children }) => {
  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content">
        <Header user={user} setUser={setUser} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
