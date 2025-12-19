// CATEGORY ROUTES

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, categoryController.getAllCategories);
router.get('/:id', authenticateToken, categoryController.getCategoryById);
router.post('/', authenticateToken, authorizeRole(['Admin', 'Manager']), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), categoryController.deleteCategory);

module.exports = router;