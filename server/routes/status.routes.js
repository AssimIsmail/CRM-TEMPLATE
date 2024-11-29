const express = require('express');
const StatusController = require('../controllers/status.controller');
const { checkUserStatus } = require('../middleware/auth.middleware');
const router = express.Router();
const authorizeRoles = require('../middleware/authorization.middleware'); 
const authenticateToken = require('../middleware/auth');

//router.get('/', authenticateToken, authorizeRoles('USER'), StatusController.getAllStatuses);
//router.get('/',authenticateToken, checkUserStatus, StatusController.getAllStatuses);
router.get('/', StatusController.getAllStatuses);
router.get('/:id', StatusController.getStatusById);
router.post('/', StatusController.createStatus);
router.put('/:id', StatusController.updateStatus);
router.delete('/:id', StatusController.deleteStatus);

module.exports = router;
