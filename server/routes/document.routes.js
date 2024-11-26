const express = require('express');
const DocumentController = require('../controllers/document.controller');
const router = express.Router();

// Route to get all documents
router.get('/', DocumentController.getAllDocuments);

// Route to get a document by ID
router.get('/:id', DocumentController.getDocumentById);

// Route to create a new document
router.post('/', DocumentController.createDocument);

// Route to update a document
router.put('/:id', DocumentController.updateDocument);

// Route to delete a document
router.delete('/:id', DocumentController.deleteDocument);

module.exports = router;
