// AUTHENTICATION CONTROLLER

const { query } = require('../config/database');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const users = await query(
      'SELECT * FROM User WHERE Username = ? AND Is_Active = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];

    if (password !== user.Password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await query(
      'UPDATE User SET Last_Login = NOW() WHERE User_ID = ?',
      [user.User_ID]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.User_ID,
        username: user.Username,
        role: user.Role
      },
      process.env.JWT_SECRET || 'your_secret_key_change_this_in_production_123456789',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.User_ID,
          username: user.Username,
          role: user.Role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// -------------------------
// GET CURRENT USER INFO
// -------------------------
const getCurrentUser = async (req, res) => {
  try {
    const users = await query(
      'SELECT User_ID, Username, Role, Created_At, Last_Login FROM User WHERE User_ID = ?',
      [req.user.userId]
    );

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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info',
      error: error.message
    });
  }
};

// -------------------------
// REGISTER USER (PLAIN TEXT PASSWORD)
// -------------------------
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and role are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const validRoles = ['Admin', 'Manager', 'Cashier'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(', ')}`
      });
    }

    // Check username existence
    const existingUsers = await query(
      'SELECT User_ID FROM User WHERE Username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Insert with PLAIN TEXT password (no hashing)
    const result = await query(
      'INSERT INTO User (Username, Password, Role) VALUES (?, ?, ?)',
      [username, password, role]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        userId: result.insertId,
        username,
        role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// -------------------------
// CHANGE PASSWORD (PLAIN TEXT)
// -------------------------
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get current user
    const users = await query(
      'SELECT * FROM User WHERE User_ID = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Verify old password (PLAIN TEXT comparison)
    if (oldPassword !== user.Password) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (PLAIN TEXT - no hashing)
    await query(
      'UPDATE User SET Password = ? WHERE User_ID = ?',
      [newPassword, req.user.userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getCurrentUser,
  register,
  changePassword
};