/**
 * Header Component
 * Top navigation bar with user info and logout
 */

import React from 'react';
import authService from '../auth/authService';

/**
 * Header Component
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.setUser - Function to update user state
 */
const Header = ({ user, setUser }) => {
  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' }}>
          CRM Dashboard
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {user.role}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
