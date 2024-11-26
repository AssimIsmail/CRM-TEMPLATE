const CentreService = require('../services/centre.service');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const getAllCentres = async (req, res) => {
  try {
    const centres = await CentreService.getAllCentres();
    res.status(200).json(centres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getCentreById = async (req, res) => {
  try {
    const centre = await CentreService.getCentreById(req.params.id);
    if (centre) {
      res.status(200).json(centre);
    } else {
      res.status(404).json({ message: 'Centre non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const createCentre = async (req, res) => {
  try {
    let logoPath = null;

    if (req.file) {
      logoPath = req.file.path.replace(/\\/g, '/');
    }

    const centreData = { ...req.body, logo: logoPath };

    const centre = await CentreService.createCentre(centreData);
    if (centre) {
      res.status(201).json(centre);
    } else {
      res.status(500).json({ message: 'Erreur lors de la création du centre' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const updateCentre = async (req, res) => {
  try {
    const centreData = { ...req.body };

    if (req.file) {
      centreData.logo = req.file.path.replace(/\\/g, '/');
    }

    const updatedCentre = await CentreService.updateCentre(req.params.id, centreData);
    if (updatedCentre) {
      res.status(200).json(updatedCentre);
    } else {
      res.status(404).json({ message: 'Centre non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCentre = async (req, res) => {
  try {
    const deletedCentre = await CentreService.deleteCentre(req.params.id);
    if (deletedCentre) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Centre non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCentres,
  getCentreById,
  createCentre,
  updateCentre,
  deleteCentre,
};
