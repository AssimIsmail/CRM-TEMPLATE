const express = require('express');
const ContactController = require('../controllers/contact.controller');
const router = express.Router();

router.post('/', ContactController.createContact);
router.get('/', ContactController.getContacts);
router.get('/:id', ContactController.getContactById);
router.put('/:id', ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);
router.get('/user/:userId', ContactController.getContactsByUserId);
router.post('/invite', ContactController.inviteContactByEmail);
router.post('/:id/accept', ContactController.acceptContactInvitation);
router.post('/:id/refuse', ContactController.refuseContactInvitation);
router.get('/user/:userId/received', ContactController.getReceivedInvitations);
router.get('/user/:userId/sent', ContactController.getSentInvitations);
router.delete('/invitations/:id', ContactController.cancelSentInvitation);

module.exports = router;
