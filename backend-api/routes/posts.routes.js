const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const postController = require('../controllers/post.controller');

// Public routes 
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes
router.post('/', requireAuth(['author']), postController.createPost);
router.put('/:id', requireAuth(['author']), postController.updatePost);
router.delete('/:id', requireAuth(['admin', 'author']), postController.deletePost);

module.exports = router;