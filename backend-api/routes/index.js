const express = require('express');
const router = express.Router();

// Import semua route
const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const userRoutes = require('./user.routes');

// Gabungkan routes dengan prefix
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

// 404 Handler
router.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = router;