const express = require('express');
const EventController = require('../controllers/event.controller');
const router = express.Router();

// Route to get all events
router.get('/', EventController.getAllEvents);

// Route to get an event by ID
router.get('/:id', EventController.getEventById);

// Route to get events by user ID
router.get('/user/:userId', EventController.getEventsByUserId);

// Route to create a new event
router.post('/', EventController.createEvent);

// Route to update an event
router.put('/:id', EventController.updateEvent);

// Route to delete an event
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
