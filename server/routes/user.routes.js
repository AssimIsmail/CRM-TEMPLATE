const express = require('express');
const UserController = require('../controllers/user.controller');
const multer = require('multer');
const router = express.Router();

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

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUserById);

router.put('/:id', upload.single('profile'), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
