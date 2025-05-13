import db from '../config/database.js';

// GET /users - Dapatkan semua user (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await db.query(
            `
            SELECT id, name, email, role, created_at 
            FROM users
            WHERE id != $1
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.json(users.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            error: 'Failed to fetch users',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
};

// PATCH /users/:id/role - Update role user
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['visitor', 'author', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const targetUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Update role error:', err);
        res.status(500).json({ error: 'Failed to update role' });
    }
};

// DELETE /users/:id - Hapus user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const targetUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [id]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await db.query('DELETE FROM users WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({
            error: 'Failed to delete user',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
};

// PATCH /users/me - Update profile user sendiri
export const updateOwnProfile = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name && !email) {
        return res.status(400).json({ error: 'No data to update' });
    }

    try {
        const existingUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (name) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }

        if (email) {
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }

        values.push(userId);

        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            values
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
