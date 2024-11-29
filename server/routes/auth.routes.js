const express = require('express');
const AuthController = require('../controllers/auth.controller');
const multer = require('multer');
const { checkUserStatus } = require('../middleware/auth.middleware');
const authenticateToken = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', upload.single('profile'), AuthController.register);

router.post('/login', AuthController.login);  

// router.post('/logout', authenticateToken, checkUserStatus, AuthController.logout);
router.post('/logout', AuthController.logout);

module.exports = router; 