const DocumentService = require('../services/document.service');

// Get all documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await DocumentService.getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await DocumentService.getDocumentById(req.params.id);
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new document
const createDocument = async (req, res) => {
  try {
    const document = await DocumentService.createDocument(req.body);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a document
const updateDocument = async (req, res) => {
  try {
    const updatedDocument = await DocumentService.updateDocument(req.params.id, req.body);
    if (updatedDocument) {
      res.status(200).json(updatedDocument);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const deleted = await DocumentService.deleteDocument(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
