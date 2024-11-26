const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Vérifie si le rôle est présent dans req.user
  
      if (!userRole) {
        return res.status(401).json({ message: 'Unauthorized: No role found' });
      }
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }
  
      next(); // L'utilisateur est autorisé
    };
  };
  
  module.exports = authorizeRoles;
  