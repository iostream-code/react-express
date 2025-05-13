const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const userController = require('../controllers/user.controller');

// Public routes
router.get('/', requireAuth(['admin']), userController.getAllUsers);
router.patch('/:id/role', requireAuth(['admin']), userController.updateUserRole);
router.delete('/:id', requireAuth(['admin']), userController.deleteUser);

// Protected routes
router.patch('/me', requireAuth(), userController.updateOwnProfile);

module.exports = router;
