const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Assurez-vous que le chemin est correct

// Fonction pour enregistrer un nouvel utilisateur
const register = async (userData) => {
  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Créer un nouvel utilisateur
  const newUser = await User.create({
    ...userData,
    password: hashedPassword, // Stocker le mot de passe haché
  });

  return newUser;
};

// Fonction pour connecter un utilisateur
const login = async (email, password) => {
  // Trouver l'utilisateur par email
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Mot de passe incorrect');
  }

  // Générer un token
  const token = jwt.sign({ id: user.id, role: user.role  }, 'votre_clé_secrète', { expiresIn: '1h' }); // Remplacez 'votre_clé_secrète' par votre clé secrète

  return { user, token }; // Retourner l'utilisateur et le token
};

module.exports = {
  register,
  login,
};
