-- Categories
INSERT INTO Category (Category_Name, Description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food & Beverage', 'Food and drink products'),
('Office Supplies', 'Stationery and office equipment'),
('Home & Garden', 'Home improvement and gardening items');

-- Users (Password: 'admin123' hashed with bcrypt)
INSERT INTO User (Username, Password, Role) VALUES
('admin', 'admin123', 'Admin'),
('manager1', 'manager123', 'Manager'),
('cashier1', 'cashier123', 'Cashier');

-- Suppliers
INSERT INTO Supplier (Name, Contact, Phone, Email, Address) VALUES
('Tech Wholesale Ltd', 'John Smith', '+62-21-1234567', 'john@techwholesale.com', 'Jakarta Business District, Jakarta'),
('Fashion Hub Inc', 'Sarah Johnson', '+62-21-7654321', 'sarah@fashionhub.com', 'Surabaya Trade Center, Surabaya'),
('Food Distributors', 'Mike Chen', '+62-274-111222', 'mike@fooddist.com', 'Malioboro Street, Yogyakarta');

-- Customers
INSERT INTO Customer (Name, Phone, Email, Address) VALUES
('Ahmad Hidayat', '+62-812-3456789', 'ahmad@email.com', 'Jl. Kaliurang No. 123, Yogyakarta'),
('Siti Nurhaliza', '+62-813-9876543', 'siti@email.com', 'Jl. Malioboro No. 45, Yogyakarta'),
('Budi Santoso', '+62-815-5555555', 'budi@email.com', 'Jl. Solo No. 78, Yogyakarta');

-- Products
INSERT INTO Products (Product_Name, Price, Stock_Quantity, Description, Category_ID, Min_Stock_Level) VALUES
('Laptop ASUS ROG', 15000000.00, 10, '15.6" Gaming Laptop with RTX 3060', 1, 5),
('Samsung Galaxy S23', 12000000.00, 25, 'Flagship smartphone with 256GB storage', 1, 10),
('Office Chair Ergonomic', 1500000.00, 50, 'Comfortable office chair with lumbar support', 4, 10),
('T-Shirt Cotton Premium', 150000.00, 100, 'High-quality cotton t-shirt', 2, 20),
('Instant Noodles Pack', 15000.00, 500, 'Pack of 5 instant noodles', 3, 100);