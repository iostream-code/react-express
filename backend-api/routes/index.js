const express = require('express');
const router = express.Router();

// Import semua route
const authRoutes = require('./auth.routes');
const postRoutes = require('./posts.routes');

// Gabungkan routes dengan prefix
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

// 404 Handler
router.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = router;