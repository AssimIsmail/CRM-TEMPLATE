const messageService = require('../services/message.service');

async function createMessage(req, res) {
    try {
        const message = await messageService.createMessage(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllMessages(req, res) {
    try {
        const messages = await messageService.getAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMessageById(req, res) {
    try {
        const message = await messageService.getMessageById(req.params.id);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateMessage(req, res) {
    try {
        const message = await messageService.updateMessage(req.params.id, req.body);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteMessage(req, res) {
    try {
        const success = await messageService.deleteMessage(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMessagesBetweenUsers(req, res) {
    try {
        let fromUserId = parseInt(req.params.fromUserId, 10);
        let toUserId = parseInt(req.params.toUserId, 10);

        if (isNaN(fromUserId) || isNaN(toUserId)) {
            return res.status(400).json({ error: 'Invalid user IDs' });
        }

        const messages = await messageService.getMessagesBetweenUsers(fromUserId, toUserId);

        if (messages.length === 0) {
            return res.status(404).json({ error: 'No messages found' });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    getMessagesBetweenUsers
};
