/**
 * Private Route Component
 * Protects routes that require authentication
 * Supports role-based access control
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../auth/authService';

/**
 * PrivateRoute Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array<string>} props.requiredRole - Optional array of allowed roles
 */
const PrivateRoute = ({ children, requiredRole = null }) => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Get current user
  const user = authService.getStoredUser();

  // Check role-based access
  if (requiredRole && user) {
    if (!requiredRole.includes(user.role)) {
      // Redirect to dashboard if user doesn't have required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
