// TRANSACTION ROUTES

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, transactionController.getAllTransactions);
router.get('/date-range', authenticateToken, transactionController.getTransactionsByDateRange);
router.get('/:id', authenticateToken, transactionController.getTransactionById);
router.get('/:id/details', authenticateToken, transactionController.getTransactionDetails);
router.post('/create', authenticateToken, transactionController.createTransaction);
router.put('/:id/cancel', authenticateToken, authorizeRole(['Admin', 'Manager']), transactionController.cancelTransaction);

module.exports = router;