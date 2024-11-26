const Document = require('../models/document.model'); // Ensure the path is correct

// Function to get all documents
const getAllDocuments = async () => {
  return await Document.findAll();
};

// Function to get a document by ID
const getDocumentById = async (id) => {
  return await Document.findByPk(id);
};

// Function to create a new document
const createDocument = async (documentData) => {
  return await Document.create(documentData);
};

// Function to update a document
const updateDocument = async (id, documentData) => {
  const document = await Document.findByPk(id);
  if (document) {
    return await document.update(documentData);
  }
  return null;
};

// Function to delete a document
const deleteDocument = async (id) => {
  const document = await Document.findByPk(id);
  if (document) {
    await document.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
