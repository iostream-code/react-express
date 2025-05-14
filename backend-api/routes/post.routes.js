const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const postController = require('../controllers/post.controller');

router.get('/', postController.getAllPosts.bind(postController));
router.get('/:id', postController.getPostById.bind(postController));

router.post('/', requireAuth(['author']), postController.createPost.bind(postController));
router.put('/:id', requireAuth(['author']), postController.updatePost.bind(postController));
router.delete('/:id', requireAuth(['admin', 'author']), postController.deletePost.bind(postController));

module.exports = router;