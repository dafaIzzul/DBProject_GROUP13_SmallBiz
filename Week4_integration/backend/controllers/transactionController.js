// TRANSACTION CONTROLLER 
const { query, transaction } = require('../config/database');

// 1. CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, notes } = req.body;
    const userId = req.user ? req.user.userId : null; 

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items required' });
    }

    const transactionId = await transaction(async (connection) => {
      // Insert Header
      const [transResult] = await connection.query(
        `INSERT INTO Transaction 
        (User_ID, Date, Total_Amount, Payment_Method, Status, Notes) 
        VALUES (?, NOW(), ?, ?, 'Completed', ?)`,
        [userId, totalAmount, paymentMethod || 'Cash', notes || 'POS Sale']
      );
      const newTransId = transResult.insertId;

      // Insert Details & Update Stock
      for (const item of items) {
        const [products] = await connection.query('SELECT Price, Stock_Quantity FROM Products WHERE Product_ID = ?', [item.productId]);
        if (products.length === 0) throw new Error(`Product ${item.productId} not found`);
        
        const product = products[0];
        if (product.Stock_Quantity < item.quantity) throw new Error(`Insufficient stock for Product ${item.productId}`);

        await connection.query('UPDATE Products SET Stock_Quantity = Stock_Quantity - ? WHERE Product_ID = ?', [item.quantity, item.productId]);
        
        await connection.query(
          `INSERT INTO Transaction_Detail (Transaction_ID, Product_ID, Quantity, Unit_Price, Subtotal) VALUES (?, ?, ?, ?, ?)`,
          [newTransId, item.productId, item.quantity, product.Price, product.Price * item.quantity]
        );
      }
      return newTransId;
    });

    res.status(201).json({ success: true, message: 'Transaction created', transactionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ALL
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await query(`
      SELECT t.*, u.Username as Cashier_Name, c.Name as Customer_Name 
      FROM Transaction t
      JOIN User u ON t.User_ID = u.User_ID
      LEFT JOIN Customer c ON t.Customer_ID = c.Customer_ID
      ORDER BY t.Transaction_ID ASC LIMIT 100
    `);
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET BY ID (Header Only)
const getTransactionById = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Transaction WHERE Transaction_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET DETAILS (Header + Items) - Diminta oleh Route /:id/details
const getTransactionDetails = async (req, res) => {
  try {
    const trans = await query(
      `SELECT t.*, u.Username as Cashier_Name 
       FROM Transaction t JOIN User u ON t.User_ID = u.User_ID 
       WHERE t.Transaction_ID = ?`, 
       [req.params.id]
    );
    if (trans.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const items = await query(
      `SELECT td.*, p.Product_Name 
       FROM Transaction_Detail td JOIN Products p ON td.Product_ID = p.Product_ID 
       WHERE td.Transaction_ID = ?`,
       [req.params.id]
    );

    res.json({ success: true, data: { ...trans[0], items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DATE RANGE
const getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const rows = await query(
      `SELECT * FROM Transaction WHERE DATE(Date) BETWEEN ? AND ? ORDER BY Date DESC`, 
      [startDate, endDate]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. CANCEL TRANSACTION - Diminta oleh Route /:id/cancel
const cancelTransaction = async (req, res) => {
  try {
    const transId = req.params.id;
    
    await transaction(async (connection) => {
      // Cek status dulu
      const [rows] = await connection.query('SELECT Status FROM Transaction WHERE Transaction_ID = ?', [transId]);
      if (rows.length === 0) throw new Error('Transaction not found');
      if (rows[0].Status === 'Cancelled') throw new Error('Already cancelled');

      // Kembalikan Stok
      const [items] = await connection.query('SELECT Product_ID, Quantity FROM Transaction_Detail WHERE Transaction_ID = ?', [transId]);
      for (const item of items) {
        await connection.query('UPDATE Products SET Stock_Quantity = Stock_Quantity + ? WHERE Product_ID = ?', [item.Quantity, item.Product_ID]);
      }

      // Update Status Transaksi
      await connection.query("UPDATE Transaction SET Status = 'Cancelled' WHERE Transaction_ID = ?", [transId]);
    });

    res.json({ success: true, message: 'Transaction cancelled and stock reverted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionDetails,
  getTransactionsByDateRange,
  cancelTransaction          
};