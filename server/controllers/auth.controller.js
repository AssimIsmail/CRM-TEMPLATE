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
    // Ajoutez le token à l'objet utilisateur
    const userWithToken = { ...user.toJSON(), token };
    res.status(200).json(userWithToken);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
}; 