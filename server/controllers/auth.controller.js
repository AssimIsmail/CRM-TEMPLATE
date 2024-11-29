const AuthService = require('../services/auth.service');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/profiles'); // Change the directory as needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    let profilePath = null;

    if (req.file) {
      profilePath = req.file.path.replace(/\\/g, '/');
    }

    const userData = { ...req.body, profile: profilePath };

    const newUser = await AuthService.register(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await AuthService.login(req.body.email, req.body.password);
    // Ajoutez le token à l'objet utilisateur sans le champ statut
    const { statut, ...userWithoutStatus } = user.toJSON(); // Exclure le champ statut
    const userWithToken = { ...userWithoutStatus, token };
    res.json(userWithToken); // Retourner l'objet utilisateur sans le champ statut
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Déconnexion d'un utilisateur
const logout = async (req, res) => {
  try {
    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user
    await AuthService.logout(userId);
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout, // Ajout de la méthode logout
}; 