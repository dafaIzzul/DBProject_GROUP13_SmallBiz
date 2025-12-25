// supplierController
const { query } = require('../config/database');

// 1. GET ALL
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await query('SELECT * FROM Supplier ORDER BY Name');
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET BY ID
const getSupplierById = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Supplier WHERE Supplier_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CREATE
const createSupplier = async (req, res) => {
  try {
    const { name, contact, phone, email, address } = req.body;
    if(!name) return res.status(400).json({success:false, message: "Nama Supplier Wajib"});
    
    await query(
        'INSERT INTO Supplier (Name, Contact, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)',
        [name, contact, phone, email, address]
    );
    res.json({ success: true, message: "Supplier Added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE (Sering terlupakan)
const updateSupplier = async (req, res) => {
  try {
    const { name, contact, phone, email, address } = req.body;
    const result = await query(
      'UPDATE Supplier SET Name=?, Contact=?, Phone=?, Email=?, Address=? WHERE Supplier_ID=?',
      [name, contact, phone, email, address, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: "Supplier Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE (Safe Delete)
const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const checkHistory = await query('SELECT COUNT(*) as count FROM Purchase WHERE Supplier_ID = ?', [supplierId]);

    if (checkHistory[0].count > 0) {
        return res.status(400).json({ success: false, message: `Gagal hapus! Supplier memiliki ${checkHistory[0].count} riwayat pembelian.` });
    }

    const result = await query('DELETE FROM Supplier WHERE Supplier_ID = ?', [supplierId]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    
    res.json({ success: true, message: 'Supplier berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. SEARCH (Dibutuhkan route search)
const searchSuppliers = async (req, res) => {
  try {
    const term = `%${req.params.query}%`;
    const rows = await query('SELECT * FROM Supplier WHERE Name LIKE ? OR Contact LIKE ?', [term, term]);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
};