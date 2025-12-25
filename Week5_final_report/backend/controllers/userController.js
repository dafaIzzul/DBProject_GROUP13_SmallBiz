const { query } = require('../config/database');


// 1. GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await query('SELECT User_ID, Username, Role, Created_At, Last_Login, Is_Active FROM User ORDER BY Created_At DESC');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const users = await query('SELECT User_ID, Username, Role, Is_Active FROM User WHERE User_ID = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CREATE USER 
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Cek username kembar
    const check = await query('SELECT * FROM User WHERE Username = ?', [username]);
    if (check.length > 0) return res.status(400).json({ success: false, message: 'Username already exists' });

    const finalPassword = password; 

    const result = await query(
      'INSERT INTO User (Username, Password, Role, Is_Active) VALUES (?, ?, ?, true)',
      [username, finalPassword, role || 'Cashier']
    );
    res.status(201).json({ success: true, message: 'User created', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { username, role } = req.body;

    await query('UPDATE User SET Username = ?, Role = ? WHERE User_ID = ?', [username, role, req.params.id]);
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. TOGGLE STATUS (Aktif/Nonaktif)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await query('SELECT Is_Active FROM User WHERE User_ID = ?', [req.params.id]);
    if (user.length === 0) return res.status(404).json({ message: 'Not found' });
    
    const newStatus = !user[0].Is_Active;
    await query('UPDATE User SET Is_Active = ? WHERE User_ID = ?', [newStatus, req.params.id]);
    
    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DELETE USER
const deleteUser = async (req, res) => {
  try {
    // Cek relasi data dulu agar aman
    const checkTrans = await query('SELECT COUNT(*) as c FROM Transaction WHERE User_ID = ?', [req.params.id]);
    if (checkTrans[0].c > 0) return res.status(400).json({ success: false, message: 'Cannot delete user with transaction history' });

    await query('DELETE FROM User WHERE User_ID = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
};