// SUPPLIER ROUTES

const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['Admin', 'Manager']), supplierController.getAllSuppliers);
router.get('/search/:query', authenticateToken, authorizeRole(['Admin', 'Manager']), supplierController.searchSuppliers);
router.get('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), supplierController.getSupplierById);
router.post('/', authenticateToken, authorizeRole(['Admin', 'Manager']), supplierController.createSupplier);
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), supplierController.updateSupplier);
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), supplierController.deleteSupplier);

module.exports = router;