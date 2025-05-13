import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
    getAllUsers,
    updateUserRole,
    updateOwnProfile,
    deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', requireAuth(['admin']), getAllUsers);
router.patch('/:id/role', requireAuth(['admin']), updateUserRole);
router.delete('/:id', requireAuth(['admin']), deleteUser);
router.patch('/me', requireAuth(), updateOwnProfile);

export default router;
