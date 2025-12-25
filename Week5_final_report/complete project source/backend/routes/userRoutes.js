const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
} = require('../controllers/userController');

router.use(authenticateToken);
router.use(authorizeRole(['Admin']));
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/toggle-active', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;