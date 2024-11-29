const tokenBlacklist = require('../path/to/tokenBlacklist'); // Ensure this points to your blacklist

const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token invalidé' });
  }
  next();
};

module.exports = checkTokenBlacklist; 