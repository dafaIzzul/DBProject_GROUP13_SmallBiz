// USER CONTROLLER
const { query } = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        User_ID,
        Username,
        Role,
        Created_At,
        Last_Login,
        Is_Active
      FROM User
      ORDER BY Created_At DESC
    `);
    
    res.json({ 
      success: true, 
      count: users.length,
      data: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        User_ID,
        Username,
        Role,
        Created_At,
        Last_Login,
        Is_Active
      FROM User 
      WHERE User_ID = ?
    `, [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user',
      error: error.message 
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { Username, Password, Role } = req.body;
    
    // Validation
    if (!Username || !Password || !Role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and role are required' 
      });
    }

    if (Password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    const validRoles = ['Admin', 'Manager', 'Cashier'];
    if (!validRoles.includes(Role)) {
      return res.status(400).json({ 
        success: false, 
        message: `Role must be one of: ${validRoles.join(', ')}` 
      });
    }

    // Check if username already exists
    const existingUsers = await query(
      'SELECT User_ID FROM User WHERE Username = ?',
      [Username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Insert new user (plain text password)
    const result = await query(`
      INSERT INTO User (Username, Password, Role, Is_Active)
      VALUES (?, ?, ?, TRUE)
    `, [Username, Password, Role]);
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: { 
        User_ID: result.insertId,
        Username,
        Role 
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user',
      error: error.message 
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { Username, Password, Role, Is_Active } = req.body;
    
    // Validation
    if (!Username || !Role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and role are required' 
      });
    }

    const validRoles = ['Admin', 'Manager', 'Cashier'];
    if (!validRoles.includes(Role)) {
      return res.status(400).json({ 
        success: false, 
        message: `Role must be one of: ${validRoles.join(', ')}` 
      });
    }

    // Check if new username conflicts with existing user
    const existingUsers = await query(
      'SELECT User_ID FROM User WHERE Username = ? AND User_ID != ?',
      [Username, req.params.id]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Build update query
    let updateQuery = `UPDATE User SET Username = ?, Role = ?, Is_Active = ?`;
    let params = [Username, Role, Is_Active !== undefined ? Is_Active : true];
    
    // If password is provided, update it too
    if (Password && Password.length >= 6) {
      updateQuery += ', Password = ?';
      params.push(Password);
    } else if (Password && Password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }
    
    updateQuery += ' WHERE User_ID = ?';
    params.push(req.params.id);

    const result = await query(updateQuery, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user',
      error: error.message 
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    // Get current status
    const users = await query(
      'SELECT Is_Active FROM User WHERE User_ID = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const currentStatus = users[0].Is_Active;
    const newStatus = !currentStatus;
    
    // Update status
    await query(
      'UPDATE User SET Is_Active = ? WHERE User_ID = ?',
      [newStatus, req.params.id]
    );
    
    res.json({ 
      success: true, 
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: { Is_Active: newStatus }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to toggle user status',
      error: error.message 
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    // Check if user has transactions or purchases
    const transactions = await query(
      'SELECT COUNT(*) as count FROM Transaction WHERE User_ID = ?',
      [req.params.id]
    );
    
    const purchases = await query(
      'SELECT COUNT(*) as count FROM Purchase WHERE User_ID = ?',
      [req.params.id]
    );
    
    const totalRecords = transactions[0].count + purchases[0].count;
    
    if (totalRecords > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete user with ${totalRecords} associated records. Consider deactivating instead.` 
      });
    }

    // Prevent deleting yourself
    if (parseInt(req.params.id) === req.user.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot delete your own account' 
      });
    }

    const result = await query(
      'DELETE FROM User WHERE User_ID = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
};

// IMPORTANT: Export all functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
};