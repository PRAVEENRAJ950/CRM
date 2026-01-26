/**
 * Admin Login Page
 * Login page for System Admin users
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../auth/authService';

const AdminLogin = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await authService.login(email, password);

      // Check if user is Admin
      if (user.role !== 'System Admin') {
        setError('Access denied. Admin login required.');
        authService.logout();
        return;
      }

      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Admin Login</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
          System Administrator Access
        </p>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '6px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <a href="/manager-login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Manager Login
          </a>
          {' | '}
          <a href="/customer-login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Customer Login
          </a>
          {' | '}
          <a href="/Create-Account" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
