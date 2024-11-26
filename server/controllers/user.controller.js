const UserService = require('../services/user.service');
const multer = require('multer');
const bcrypt = require('bcrypt');

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

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    // Fetch the current user data
    const currentUser = await UserService.getUserById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    let profilePath = currentUser.profile; // Default to existing profile path

    // Update profile path if a new file is uploaded
    if (req.file) {
      profilePath = req.file.path.replace(/\\/g, '/');
    }

    const userData = { ...req.body, profile: profilePath };

    // Check if password is provided and hash it
    if (req.body.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    console.log('User Data:', userData);

    const user = await UserService.updateUser(req.params.id, userData);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
    try {
      const deleted = await UserService.deleteUser(req.params.id);
      if (deleted) {
        res.status(204).send(); 
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
