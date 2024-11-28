const Contact = require('../models/contact.model');
const { Op } = require('sequelize');
const User = require('../models/user.model');

exports.createContact = async (contactData) => {
    // Check if the contact already exists
    const existingContact = await Contact.findOne({
        where: {
            user_id: contactData.user_id,
            contact_id: contactData.contact_id
        }
    });

    if (existingContact) {
        throw new Error('Contact already exists');
    }

    // Create the contact if it doesn't exist
    return await Contact.create(contactData);
};

exports.getContacts = async () => {
    return await Contact.findAll();
};

exports.getContactById = async (id) => {
    return await Contact.findByPk(id);
};

exports.updateContact = async (id, contactData) => {
    const contact = await Contact.findByPk(id);
    if (contact) {
        return await contact.update(contactData);
    }
    return null;
};

exports.deleteContact = async (id) => {
    const contact = await Contact.findByPk(id);
    if (contact) {
        await contact.destroy();
        return true;
    }
    return false;
};

exports.getContactsByUserId = async (userId) => {
    return await Contact.findAll({
        where: {
            [Op.or]: [
                { user_id: userId },
                { contact_id: userId }
            ]
        }
    });
};

exports.inviteContactByEmail = async (email, currentUserId) => {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    // Prevent self-invitation
    if (user.id === currentUserId) {
        throw new Error('Cannot invite yourself');
    }

    // Check if the contact already exists
    const existingContact = await Contact.findOne({
        where: {
            user_id: currentUserId,
            contact_id: user.id
        }
    });

    if (existingContact) {
        throw new Error('Contact already exists');
    }

    // Create the contact invitation
    return await Contact.create({
        user_id: currentUserId,
        contact_id: user.id,
        status: 'pending'
    });
};

exports.updateContactStatus = async (id, status) => {
    const contact = await Contact.findByPk(id);
    if (contact) {
        contact.status = status;
        return await contact.save();
    }
    return null;
};



exports.getReceivedInvitationsByUserId = async (userId) => {
    return await Contact.findAll({
        where: {
            contact_id: userId,
            status: 'pending'
        },
    });
};

exports.getSentInvitationsByUserId = async (userId) => {
    return await Contact.findAll({
        where: {
            user_id: userId,
            status: 'pending'
        },
    });
};

exports.cancelSentInvitation = async (invitationId) => {
    const invitation = await Contact.findByPk(invitationId);
    if (invitation && invitation.status === 'pending') {
        await invitation.destroy();
        return true;
    }
    return false;
};
