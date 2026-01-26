/**
 * Role-Based Access Control Middleware
 * Restricts routes based on user roles
 */

/**
 * Middleware to check if user has required role(s)
 * @param {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware function
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated (should be called after authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is Admin
 * Admin has full access to all resources
 */
export const requireAdmin = requireRole('System Admin');

/**
 * Middleware to check if user is Manager or Admin
 * Managers and Admins can manage teams and view reports
 */
export const requireManager = requireRole('System Admin', 'Sales Manager');

/**
 * Middleware to check if user is Executive or above
 * Executives can manage their own data
 */
export const requireExecutive = requireRole(
  'System Admin',
  'Sales Manager',
  'Sales Executive',
  'Marketing Executive',
  'Support Executive'
);

/**
 * Middleware to check if user can write (not Customer)
 * Customers have read-only access
 */
export const requireWriteAccess = requireRole(
  'System Admin',
  'Sales Manager',
  'Sales Executive',
  'Marketing Executive',
  'Support Executive'
);

/**
 * Middleware to check resource ownership or admin access
 * Users can access their own resources, admins can access all
 * @param {Function} getResourceOwnerId - Function to get owner ID from request
 */
export const requireOwnershipOrAdmin = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Admin has full access
    if (req.user.role === 'System Admin') {
      return next();
    }

    // Get resource owner ID
    const ownerId = getResourceOwnerId(req);

    // Check if user owns the resource
    if (ownerId && ownerId.toString() === req.user._id.toString()) {
      return next();
    }

    // Check if user is manager (managers can view team resources)
    if (req.user.role === 'Sales Manager') {
      // Additional logic can be added here to check team membership
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.',
    });
  };
};
