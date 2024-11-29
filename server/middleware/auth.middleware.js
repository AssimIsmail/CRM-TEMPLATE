const User = require('../models/user.model'); // Assurez-vous que le chemin est correct

// Middleware pour vérifier le statut de l'utilisateur
const checkUserStatus = async (req, res, next) => {
  try {
    // Vérifiez si req.user est défini
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifiez le statut de l'utilisateur
    if (!user.statut) {
      return res.status(403).json({ message: 'Accès refusé : utilisateur inactif' });
    }

    next(); // L'utilisateur est actif, continuer à la prochaine fonction middleware
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkUserStatus,
}; 