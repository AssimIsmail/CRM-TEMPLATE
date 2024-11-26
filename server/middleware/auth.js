const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupérer le token

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, 'votre_clé_secrète', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });

    req.user = user; // Ajout des informations utilisateur (id, role, etc.) au req
    next();
  });
};

module.exports = authenticateToken;
