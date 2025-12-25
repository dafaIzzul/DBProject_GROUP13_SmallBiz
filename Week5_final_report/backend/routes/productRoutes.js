// PRODUCT ROUTES

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, productController.getAllProducts);
router.get('/low-stock', authenticateToken, productController.getLowStockProducts);
router.get('/search/:query', authenticateToken, productController.searchProducts);
router.get('/:id', authenticateToken, productController.getProductById);
router.post('/', authenticateToken, authorizeRole(['Admin', 'Manager']), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), productController.deleteProduct);

module.exports = router;