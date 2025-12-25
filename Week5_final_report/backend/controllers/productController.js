// productController
const { query } = require('../config/database');

// 1. GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await query(`
      SELECT 
        p.Product_ID, p.Product_Name, p.Price, p.Stock_Quantity, 
        p.Description, p.Min_Stock_Level,
        c.Category_Name, c.Category_ID,
        CASE 
          WHEN p.Stock_Quantity = 0 THEN 'Out of Stock'
          WHEN p.Stock_Quantity <= p.Min_Stock_Level THEN 'Low Stock'
          ELSE 'In Stock'
        END AS Stock_Status
      FROM Products p
      JOIN Category c ON p.Category_ID = c.Category_ID
      ORDER BY p.Product_ID ASC 
    `);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*, c.Category_Name 
      FROM Products p
      JOIN Category c ON p.Category_ID = c.Category_ID
      WHERE p.Product_ID = ?`, 
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, categoryId, price, stock, minStock, description } = req.body;
    if (!name || !categoryId || !price) {
      return res.status(400).json({ success: false, message: 'Nama, Kategori, dan Harga wajib diisi!' });
    }
    const result = await query(
      `INSERT INTO Products (Product_Name, Category_ID, Price, Stock_Quantity, Min_Stock_Level, Description) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, categoryId, price, stock, minStock || 10, description]
    );
    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE PRODUCT 
const updateProduct = async (req, res) => {
  try {
    const { name, categoryId, price, stock, minStock, description } = req.body;
    const result = await query(
      `UPDATE Products SET Product_Name=?, Category_ID=?, Price=?, Stock_Quantity=?, Min_Stock_Level=?, Description=? WHERE Product_ID=?`,
      [name, categoryId, price, stock, minStock, description, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await query('DELETE FROM Products WHERE Product_ID = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal hapus (Mungkin produk ada di transaksi)', error: error.message });
  }
};

// 6. SEARCH PRODUCTS 
const searchProducts = async (req, res) => {
  try {
    const term = `%${req.params.query}%`;
    const products = await query(
      `SELECT p.*, c.Category_Name FROM Products p JOIN Category c ON p.Category_ID = c.Category_ID WHERE p.Product_Name LIKE ?`, 
      [term]
    );
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. GET LOW STOCK 
const getLowStockProducts = async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*, c.Category_Name FROM Products p JOIN Category c ON p.Category_ID = c.Category_ID WHERE p.Stock_Quantity <= p.Min_Stock_Level
    `);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStockProducts
};