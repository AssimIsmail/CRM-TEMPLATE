const Contact = require('../models/contact.model');
const { Op } = require('sequelize');

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
