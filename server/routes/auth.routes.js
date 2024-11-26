const express = require('express');
const AuthController = require('../controllers/auth.controller');
const multer = require('multer');

// Use the same storage configuration as in the controller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/profiles'); // Ensure this matches the controller
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route pour l'inscription avec upload de fichier
router.post('/register', upload.single('profile'), AuthController.register);

// Route pour la connexion
router.post('/login', AuthController.login);

module.exports = router; 