// PURCHASE ROUTES

const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.getAllPurchases);
router.get('/date-range', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.getPurchasesByDateRange);
router.get('/supplier/:supplierId', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.getPurchasesBySupplier);
router.get('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.getPurchaseById);
router.get('/:id/details', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.getPurchaseDetails);
router.post('/create', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.createPurchase);
router.put('/:id/cancel', authenticateToken, authorizeRole(['Admin', 'Manager']), purchaseController.cancelPurchase);

module.exports = router;