// CUSTOMER ROUTES

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, customerController.getAllCustomers);
router.get('/search/:query', authenticateToken, customerController.searchCustomers);
router.get('/:id', authenticateToken, customerController.getCustomerById);
router.post('/', authenticateToken, customerController.createCustomer);
router.put('/:id', authenticateToken, customerController.updateCustomer);
router.delete('/:id', authenticateToken, authorizeRole(['Admin', 'Manager']), customerController.deleteCustomer);

module.exports = router;