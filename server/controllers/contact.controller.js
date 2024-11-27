const ContactService = require('../services/contact.service');
const Contact = require('../models/contact.model');
const { Op } = require('sequelize');

exports.createContact = async (req, res) => {
    try {
        const contact = await ContactService.createContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        if (error.message === 'Contact already exists') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await ContactService.getContacts();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await ContactService.getContactById(req.params.id);
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const updatedContact = await ContactService.updateContact(req.params.id, req.body);
        if (updatedContact) {
            res.status(200).json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const deleted = await ContactService.deleteContact(req.params.id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { user_id: userId },
                    { contact_id: userId }
                ]
            }
        });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
