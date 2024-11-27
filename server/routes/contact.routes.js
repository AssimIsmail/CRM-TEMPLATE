const express = require('express');
const ContactController = require('../controllers/contact.controller');
const router = express.Router();

router.post('/', ContactController.createContact);
router.get('/', ContactController.getContacts);
router.get('/:id', ContactController.getContactById);
router.put('/:id', ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);
router.get('/user/:userId', ContactController.getContactsByUserId);

module.exports = router;
