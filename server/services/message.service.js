const { Op } = require('sequelize');
const Message = require('../models/message.model');

async function createMessage(data) {
    return await Message.create(data);
}

async function getAllMessages() {
    return await Message.findAll();
}

async function getMessageById(id) {
    return await Message.findByPk(id);
}

async function updateMessage(id, data) {
    const message = await Message.findByPk(id);
    if (message) {
        return await message.update(data);
    }
    return null;
}

async function deleteMessage(id) {
    const message = await Message.findByPk(id);
    if (message) {
        await message.destroy();
        return true;
    }
    return false;
}

async function getMessagesBetweenUsers(fromUserId, toUserId) {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { from_user_id: fromUserId, to_user_id: toUserId },
                    { from_user_id: toUserId, to_user_id: fromUserId }
                ]
            },
            order: [['time', 'ASC']]
        });
        return messages || [];
    } catch (error) {
        console.error('Database query error:', error); // Log the error
        throw new Error('Database query failed');
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
