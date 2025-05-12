const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const db = require('../config/database');

// Validasi input post
const validatePostInput = (req, res, next) => {
    const { title, content } = req.body;

    if (!title || title.trim().length < 3) {
        return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (!content || content.trim().length < 10) {
        return res.status(400).json({ error: 'Content must be at least 10 characters' });
    }

    next();
};

// GET semua posts (admin + visitor)
router.get('/', requireAuth(['admin', 'visitor', 'author']), async (req, res) => {
    try {
        const { rows } = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at,
        u.name as author_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET post by ID (admin + visitor + pemilik post)
router.get('/:id', requireAuth(['admin', 'visitor', 'author']), async (req, res) => {
    try {
        const { rows } = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at,
        u.name as author_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);

        if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new post (admin dan author)
router.post(
    '/',
    requireAuth(['admin', 'author']),
    validatePostInput,
    async (req, res) => {
        try {
            const { title, content } = req.body;

            const { rows } = await db.query(
                `INSERT INTO posts (title, content, user_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
                [title, content, req.user.id]
            );

            res.status(201).json(rows[0]);
        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Failed to create post' });
        }
    }
);

// PUT update post (admin dan pemilik post)
router.put(
    '/:id',
    requireAuth(['admin', 'author']),
    validatePostInput,
    async (req, res) => {
        try {
            // Cek kepemilikan post
            const post = await db.query(
                'SELECT user_id FROM posts WHERE id = $1',
                [req.params.id]
            );

            if (!post.rows[0]) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Author hanya bisa update post miliknya
            if (req.user.role !== 'admin' && post.rows[0].user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized action' });
            }

            const { rows } = await db.query(
                `UPDATE posts 
         SET title = $1, content = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
                [req.body.title, req.body.content, req.params.id]
            );

            res.json(rows[0]);
        } catch (err) {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'Failed to update post' });
        }
    }
);

// DELETE post (admin dan pemilik post)
router.delete('/:id', requireAuth(['admin', 'author']), async (req, res) => {
    try {
        // Cek kepemilikan post
        const post = await db.query(
            'SELECT user_id FROM posts WHERE id = $1',
            [req.params.id]
        );

        if (!post.rows[0]) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Author hanya bisa hapus post miliknya
        if (req.user.role !== 'admin' && post.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;