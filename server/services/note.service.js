const Note = require('../models/note.model'); // Ensure the path is correct

// Function to get all notes
const getAllNotes = async () => {
  return await Note.findAll();
};

// Function to get a note by ID
const getNoteById = async (id) => {
  return await Note.findByPk(id);
};

// Function to get notes by user ID
const getNotesByUserId = async (userId) => {
  return await Note.findAll({ where: { userId } });
};

// Function to create a new note
const createNote = async (noteData) => {
  return await Note.create(noteData);
};

// Function to update a note
const updateNote = async (id, noteData) => {
  const note = await Note.findByPk(id);
  if (note) {
    return await note.update(noteData);
  }
  return null;
};

// Function to delete a note
const deleteNote = async (id) => {
  const note = await Note.findByPk(id);
  if (note) {
    await note.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllNotes,
  getNoteById,
  getNotesByUserId,
  createNote,
  updateNote,
  deleteNote,
};
