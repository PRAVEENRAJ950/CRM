/**
 * Main App Component
 * Sets up routing and application structure
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from './auth/authService';

// Pages
import AdminLogin from './pages/AdminLogin';
import ManagerLogin from './pages/ManagerLogin';
import CustomerLogin from './pages/CustomerLogin';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Activities from './pages/Activities';
import Customers from './pages/Customers';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/manager-login" element={<ManagerLogin setUser={setUser} />} />
        <Route path="/customer-login" element={<CustomerLogin setUser={setUser} />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Leads />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deals"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Deals />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Activities />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Customers />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute requiredRole={['System Admin', 'Sales Manager']}>
              <Layout user={user} setUser={setUser}>
                <Users />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute requiredRole={['System Admin', 'Sales Manager']}>
              <Layout user={user} setUser={setUser}>
                <Reports />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout user={user} setUser={setUser}>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
