// PURCHASE CONTROLLER (COMPLETE & FIXED)
const { query, transaction } = require('../config/database');

// 1. GET ALL
const getAllPurchases = async (req, res) => {
  try {
    const rows = await query(`
      SELECT p.*, s.Name as Supplier_Name, u.Username as Created_By
      FROM Purchase p
      JOIN Supplier s ON p.Supplier_ID = s.Supplier_ID
      JOIN User u ON p.User_ID = u.User_ID
      ORDER BY p.Date DESC LIMIT 100
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. CREATE PURCHASE
const createPurchase = async (req, res) => {
  try {
    const { supplierId, items, totalCost, notes } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const purchaseId = await transaction(async (connection) => {
      // Insert Header
      const [resPurchase] = await connection.query(
        `INSERT INTO Purchase (Supplier_ID, User_ID, Date, Total_Cost, Status, Notes) VALUES (?, ?, NOW(), ?, 'Completed', ?)`,
        [supplierId, userId, totalCost, notes]
      );
      const newId = resPurchase.insertId;

      // Insert Details & Add Stock
      for (const item of items) {
        await connection.query(
          `INSERT INTO Purchase_Detail (Purchase_ID, Product_ID, Quantity, Unit_Cost, Subtotal) VALUES (?, ?, ?, ?, ?)`,
          [newId, item.productId, item.quantity, item.unitCost, item.quantity * item.unitCost]
        );
        await connection.query('UPDATE Products SET Stock_Quantity = Stock_Quantity + ? WHERE Product_ID = ?', [item.quantity, item.productId]);
      }
      return newId;
    });

    res.status(201).json({ success: true, message: 'Restock successful', purchaseId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET BY ID
const getPurchaseById = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Purchase WHERE Purchase_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET DETAILS
const getPurchaseDetails = async (req, res) => {
  try {
    const rows = await query(
      `SELECT pd.*, p.Product_Name FROM Purchase_Detail pd 
       JOIN Products p ON pd.Product_ID = p.Product_ID 
       WHERE pd.Purchase_ID = ?`, 
       [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. BY SUPPLIER
const getPurchasesBySupplier = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Purchase WHERE Supplier_ID = ? ORDER BY Date DESC', [req.params.supplierId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DATE RANGE
const getPurchasesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const rows = await query('SELECT * FROM Purchase WHERE DATE(Date) BETWEEN ? AND ?', [startDate, endDate]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. CANCEL PURCHASE (Rollback Stock)
const cancelPurchase = async (req, res) => {
  try {
    const pId = req.params.id;
    await transaction(async (connection) => {
      const [rows] = await connection.query('SELECT Status FROM Purchase WHERE Purchase_ID = ?', [pId]);
      if (rows.length === 0) throw new Error('Purchase not found');
      if (rows[0].Status === 'Cancelled') throw new Error('Already cancelled');

      // Kurangi Stok Kembali
      const [items] = await connection.query('SELECT Product_ID, Quantity FROM Purchase_Detail WHERE Purchase_ID = ?', [pId]);
      for (const item of items) {
        await connection.query('UPDATE Products SET Stock_Quantity = Stock_Quantity - ? WHERE Product_ID = ?', [item.Quantity, item.Product_ID]);
      }

      await connection.query("UPDATE Purchase SET Status = 'Cancelled' WHERE Purchase_ID = ?", [pId]);
    });
    res.json({ success: true, message: 'Purchase cancelled and stock reverted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPurchases,
  createPurchase,
  getPurchaseById,
  getPurchaseDetails,
  getPurchasesBySupplier,
  getPurchasesByDateRange,
  cancelPurchase
};