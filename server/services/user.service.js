const User = require('../models/user.model'); // Assurez-vous que le chemin est correct
const bcrypt = require('bcrypt');

// Fonction pour récupérer tous les utilisateurs
const getAllUsers = async () => {
  return await User.findAll();
};

// Fonction pour récupérer un utilisateur par ID
const getUserById = async (id) => {
  return await User.findByPk(id);
};


// Fonction pour mettre à jour un utilisateur sans modifier le mot de passe
const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (user) {
    return await user.update(userData);
  }
  return null;
};


// Fonction pour supprimer un utilisateur
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
