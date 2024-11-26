const NoteService = require('../services/note.service');

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await NoteService.getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await NoteService.getNoteById(req.params.id);
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notes by user ID
const getNotesByUserId = async (req, res) => {
  try {
    const notes = await NoteService.getNotesByUserId(req.params.userId);
    if (notes.length > 0) {
      res.status(200).json(notes);
    } else {
      res.status(404).json({ message: 'No notes found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const note = await NoteService.createNote(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const updatedNote = await NoteService.updateNote(req.params.id, req.body);
    if (updatedNote) {
      res.status(200).json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const deleted = await NoteService.deleteNote(req.params.id);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  getNotesByUserId,
  createNote,
  updateNote,
  deleteNote,
};
