const express = require('express');
const NoteController = require('../controllers/note.controller');
const router = express.Router();

// Route to get all notes
router.get('/', NoteController.getAllNotes);

// Route to get a note by ID
router.get('/:id', NoteController.getNoteById);

// Route to get notes by user ID
router.get('/user/:userId', NoteController.getNotesByUserId);

// Route to create a new note
router.post('/', NoteController.createNote);

// Route to update a note
router.put('/:id', NoteController.updateNote);

// Route to delete a note
router.delete('/:id', NoteController.deleteNote);

module.exports = router;
