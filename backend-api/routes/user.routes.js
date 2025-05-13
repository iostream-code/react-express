import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import db from '../config/database.js'; // Pastikan ini diimport

const router = express.Router();

// GET /users - Dapatkan semua user (admin only)
router.get('/', requireAuth(['admin']), async (req, res) => {
    try {
        // Exclude current user dari hasil query
        const users = await db.query(`
            SELECT id, name, email, role, created_at 
            FROM users
            WHERE id != $1
            ORDER BY created_at DESC
        `, [req.user.id]); // Gunakan parameterized query

        res.json(users.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            error: 'Failed to fetch users',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
});

// PATCH /users/:id/role - Update role user
router.patch('/:id/role', requireAuth(['admin']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // Validasi role
    if (!['visitor', 'editor', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        // Cek apakah user target ada
        const targetUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update role
        await db.query(
            'UPDATE users SET role = $1 WHERE id = $2',
            [role, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Update role error:', err);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// DELETE /users/:id - Hapus user
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // Cek apakah user target ada
        const targetUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hapus user
        await db.query('DELETE FROM users WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({
            error: 'Failed to delete user',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
});

export default router;