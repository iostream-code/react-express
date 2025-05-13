const db = require('../config/database');

class PostController {
    // [ALL ROLES] Get all published posts
    async getAllPosts(req, res) {
        try {
            let query = `
                SELECT 
                    p.id, 
                    p.title, 
                    p.content,
                    p.created_at AS "createdAt",
                    p.updated_at AS "updatedAt",
                    u.id AS "authorId",
                    u.name,
                FROM posts p
                JOIN users u ON p.user_id = u.id
            `;

            // Visitor hanya bisa lihat published posts
            if (req.user?.role === 'visitor' || !req.user) {
                query += ` ORDER BY p.created_at DESC`;
                const result = await db.query(query);
                return res.json(this.formatPosts(result.rows));
            }

            // Admin dan Author bisa lihat semua posts
            const result = await db.query(query + ` ORDER BY p.created_at DESC`);
            res.json(this.formatPosts(result.rows));
        } catch (err) {
            console.error('Error getting posts:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // [ALL ROLES] Get single post
    async getPostById(req, res) {
        try {
            const result = await db.query(
                `SELECT 
                    p.id, 
                    p.title, 
                    p.content,
                    p.created_at AS "createdAt",
                    p.updated_at AS "updatedAt",
                    u.id AS "authorId",
                    u.name,
                 FROM posts p
                 JOIN users u ON p.user_id = u.id
                 WHERE p.id = $1`,
                [req.params.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json(this.formatPost(result.rows[0]));
        } catch (err) {
            console.error('Error getting post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // [AUTHOR ONLY] Create new post
    async createPost(req, res) {
        try {
            if (req.user.role !== 'author') {
                return res.status(403).json({ error: 'Only authors can create posts' });
            }

            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
            }

            const result = await db.query(
                `INSERT INTO posts (title, content, user_id)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [title, content, req.user.id]
            );

            res.status(201).json(this.formatPost(result.rows[0]));
        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // [AUTHOR ONLY] Update own post
    async updatePost(req, res) {
        try {
            if (req.user.role !== 'author') {
                return res.status(403).json({ error: 'Only authors can update posts' });
            }

            // Cek kepemilikan post
            const checkResult = await db.query(
                'SELECT id FROM posts WHERE id = $1 AND user_id = $2',
                [req.params.id, req.user.id]
            );

            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found or not authorized' });
            }

            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
            }

            const updateResult = await db.query(
                `UPDATE posts 
                 SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $3
                 RETURNING *`,
                [title, content, req.params.id]
            );

            res.json(this.formatPost(updateResult.rows[0]));
        } catch (err) {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // [ADMIN & AUTHOR] Delete post
    async deletePost(req, res) {
        try {
            // Admin bisa hapus semua post
            if (req.user.role === 'admin') {
                await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
                return res.json({ message: 'Post deleted successfully' });
            }

            // Author hanya bisa hapus post sendiri
            if (req.user.role === 'author') {
                const result = await db.query(
                    'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
                    [req.params.id, req.user.id]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Post not found or not authorized' });
                }

                return res.json({ message: 'Post deleted successfully' });
            }

            // Visitor tidak bisa hapus
            res.status(403).json({ error: 'Permission denied' });
        } catch (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Helper method to format post data
    formatPost(post) {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            author: {
                id: post.authorId,
                name: post.name,
            }
        };
    }

    // Helper method to format array of posts
    formatPosts(posts) {
        return posts.map(post => this.formatPost(post));
    }
}

module.exports = new PostController();