const { query } = require('../config/database');

// 1. GET ALL
const getAllCustomers = async (req, res) => {
  try {
    const customers = await query('SELECT * FROM Customer ORDER BY Name ASC');
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET BY ID
const getCustomerById = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Customer WHERE Customer_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. SEARCH
const searchCustomers = async (req, res) => {
  try {
    const term = `%${req.params.query}%`;
    const rows = await query('SELECT * FROM Customer WHERE Name LIKE ? OR Phone LIKE ?', [term, term]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. CREATE
const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    
    const result = await query(
      'INSERT INTO Customer (Name, Phone, Email, Address) VALUES (?, ?, ?, ?)',
      [name, phone, email, address]
    );
    res.status(201).json({ success: true, message: 'Customer added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. UPDATE
const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    await query(
      'UPDATE Customer SET Name=?, Phone=?, Email=?, Address=? WHERE Customer_ID=?',
      [name, phone, email, address, req.params.id]
    );
    res.json({ success: true, message: 'Customer updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DELETE
const deleteCustomer = async (req, res) => {
  try {
    // Cek riwayat transaksi
    const check = await query('SELECT COUNT(*) as c FROM Transaction WHERE Customer_ID = ?', [req.params.id]);
    if (check[0].c > 0) return res.status(400).json({ success: false, message: 'Cannot delete customer with transactions' });

    await query('DELETE FROM Customer WHERE Customer_ID = ?', [req.params.id]);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};