const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const messageService = require('../services/message.service');

// Create a new message
router.post('/', messageController.createMessage);

// Get all messages
router.get('/', messageController.getAllMessages);

// Get a message by ID
router.get('/:id', messageController.getMessageById);

// Update a message by ID
router.put('/:id', messageController.updateMessage);

// Delete a message by ID
router.delete('/:id', messageController.deleteMessage);

// Get messages between two users
router.get('/between/:fromUserId/:toUserId', async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.params;
        const messages = await messageService.getMessagesBetweenUsers(fromUserId, toUserId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router; 