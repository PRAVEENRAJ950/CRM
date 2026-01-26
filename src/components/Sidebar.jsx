/**
 * Sidebar Component
 * Navigation sidebar with role-based menu items
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 */
const Sidebar = ({ user }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Define menu items based on user role
  const getMenuItems = () => {
    const role = user?.role || 'Customer';

    const allItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['all'] },
      { path: '/leads', label: 'Leads', icon: '👥', roles: ['System Admin', 'Sales Manager', 'Sales Executive', 'Marketing Executive'] },
      { path: '/deals', label: 'Deals', icon: '💼', roles: ['System Admin', 'Sales Manager', 'Sales Executive'] },
      { path: '/activities', label: 'Activities', icon: '📅', roles: ['System Admin', 'Sales Manager', 'Sales Executive', 'Support Executive'] },
      { path: '/customers', label: 'Customers', icon: '🏢', roles: ['all'] },
      { path: '/users', label: 'Users', icon: '👤', roles: ['System Admin', 'Sales Manager'] },
      { path: '/reports', label: 'Reports', icon: '📈', roles: ['System Admin', 'Sales Manager'] },
      { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['all'] },
    ];

    // Filter items based on user role
    return allItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(role)
    );
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: isOpen ? 'var(--sidebar-width)' : '70px',
        minHeight: '100vh',
        backgroundColor: '#1e293b',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: 'width 0.3s ease',
        padding: '20px 0',
        zIndex: 1000,
      }}
    >
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
          {isOpen ? 'CRM System' : 'CRM'}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              color: isActive(item.path) ? '#60a5fa' : '#cbd5e1',
              textDecoration: 'none',
              backgroundColor: isActive(item.path) ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #60a5fa' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '20px', marginRight: isOpen ? '12px' : '0', minWidth: '24px' }}>
              {item.icon}
            </span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isOpen && user && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{user.name}</div>
          <div style={{ opacity: 0.8 }}>{user.role}</div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
