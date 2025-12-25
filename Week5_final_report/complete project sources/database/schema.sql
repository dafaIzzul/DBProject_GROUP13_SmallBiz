-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE Category (
  Category_ID INT AUTO_INCREMENT,
  Category_Name VARCHAR(100) NOT NULL,
  Description VARCHAR(500),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Category_ID),
  UNIQUE (Category_Name)
);

CREATE TABLE Customer (
  Customer_ID INT AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Phone VARCHAR(20),
  Email VARCHAR(100),
  Address VARCHAR(500),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (Customer_ID),
  UNIQUE (Email),
  CHECK (Email LIKE '%@%.%')
);

CREATE TABLE User (
  User_ID INT AUTO_INCREMENT,
  Username VARCHAR(50) NOT NULL,
  Password VARCHAR(255) NOT NULL, -- For hashed passwords
  Role ENUM('Admin', 'Manager', 'Cashier') NOT NULL DEFAULT 'Cashier',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Last_Login TIMESTAMP NULL,
  Is_Active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (User_ID),
  UNIQUE (Username)
);

CREATE TABLE Supplier (
  Supplier_ID INT AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Contact VARCHAR(100) NOT NULL,
  Phone VARCHAR(20),
  Email VARCHAR(100),
  Address VARCHAR(500) NOT NULL,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (Supplier_ID),
  UNIQUE (Name)
);

CREATE TABLE Products (
  Product_ID INT AUTO_INCREMENT,
  Product_Name VARCHAR(100) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  Stock_Quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  Description VARCHAR(500),
  Category_ID INT NOT NULL,
  Min_Stock_Level DECIMAL(10,2) DEFAULT 10, -- For low stock alerts
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (Product_ID),
  FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (Price >= 0),
  CHECK (Stock_Quantity >= 0)
);

-- ============================================
-- TRANSACTION TABLES
-- ============================================

CREATE TABLE Transaction (
  Transaction_ID INT AUTO_INCREMENT,
  Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Total_Amount DECIMAL(10,2) NOT NULL,
  Customer_ID INT,
  User_ID INT NOT NULL,
  Payment_Method ENUM('Cash', 'Credit Card', 'Debit Card', 'Transfer') DEFAULT 'Cash',
  Status ENUM('Completed', 'Pending', 'Cancelled') DEFAULT 'Completed',
  Notes VARCHAR(500),
  PRIMARY KEY (Transaction_ID),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES User(User_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (Total_Amount >= 0)
);

CREATE TABLE Transaction_Detail (
  Detail_ID INT AUTO_INCREMENT,
  Transaction_ID INT NOT NULL,
  Product_ID INT NOT NULL,
  Quantity DECIMAL(10,2) NOT NULL,
  Unit_Price DECIMAL(10,2) NOT NULL,
  Subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (Detail_ID),
  FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (Quantity > 0),
  CHECK (Unit_Price >= 0),
  CHECK (Subtotal >= 0)
);

CREATE TABLE Purchase (
  Purchase_ID INT AUTO_INCREMENT,
  Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Total_Cost DECIMAL(10,2) NOT NULL,
  Supplier_ID INT NOT NULL,
  User_ID INT NOT NULL,
  Status ENUM('Completed', 'Pending', 'Cancelled') DEFAULT 'Pending',
  Notes VARCHAR(500),
  PRIMARY KEY (Purchase_ID),
  FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES User(User_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (Total_Cost >= 0)
);

CREATE TABLE Purchase_Detail (
  Detail_ID INT AUTO_INCREMENT,
  Purchase_ID INT NOT NULL,
  Product_ID INT NOT NULL,
  Quantity DECIMAL(10,2) NOT NULL,
  Unit_Cost DECIMAL(10,2) NOT NULL,
  SubTotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (Detail_ID),
  FOREIGN KEY (Purchase_ID) REFERENCES Purchase(Purchase_ID) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (Quantity > 0),
  CHECK (Unit_Cost >= 0),
  CHECK (SubTotal >= 0)
);