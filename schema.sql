-- Medical Supply Management System Database Schema

-- Create database
CREATE DATABASE medical_supply_management;
USE medical_supply_management;

-- Suppliers table
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical supplies table
CREATE TABLE medical_supplies (
    supply_id INT PRIMARY KEY AUTO_INCREMENT,
    supply_name VARCHAR(255) NOT NULL,
    category_id INT,
    supplier_id INT,
    unit_price DECIMAL(10, 2) NOT NULL,
    current_stock INT DEFAULT 0,
    minimum_stock INT DEFAULT 0,
    maximum_stock INT DEFAULT 1000,
    expiry_date DATE,
    batch_number VARCHAR(100),
    description TEXT,
    status ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Purchase orders table
CREATE TABLE purchase_orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_id INT,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    total_amount DECIMAL(12, 2),
    status ENUM('Pending', 'Approved', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Purchase order items table
CREATE TABLE purchase_order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    supply_id INT,
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity_ordered * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES purchase_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES medical_supplies(supply_id)
);

-- Stock transactions table (for tracking stock movements)
CREATE TABLE stock_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    supply_id INT,
    transaction_type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    reference_type ENUM('PURCHASE', 'USAGE', 'EXPIRED', 'DAMAGED', 'ADJUSTMENT') NOT NULL,
    reference_id INT, -- Could reference purchase_order_id or other relevant ID
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    performed_by VARCHAR(100),
    FOREIGN KEY (supply_id) REFERENCES medical_supplies(supply_id)
);

-- Users table (for system access control)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('Admin', 'Manager', 'Staff') DEFAULT 'Staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data

-- Insert categories
INSERT INTO categories (category_name, description) VALUES
('PPE', 'Personal Protective Equipment'),
('Injection', 'Injection and syringe supplies'),
('Wound Care', 'Bandages and wound treatment supplies'),
('Diagnostic', 'Diagnostic equipment and tools'),
('Medication', 'Pharmaceutical supplies'),
('Equipment', 'Medical equipment and devices');

-- Insert suppliers
INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES
('MedCorp Inc', 'John Smith', '+1-555-0101', 'john@medcorp.com', '123 Medical Ave, Healthcare City, HC 12345'),
('SafeGuard Medical', 'Sarah Johnson', '+1-555-0102', 'sarah@safeguard.com', '456 Safety Blvd, Protection Town, PT 67890'),
('PharmaSupply Co', 'Mike Wilson', '+1-555-0103', 'mike@pharmasupply.com', '789 Pharma Street, Medicine City, MC 11111'),
('TechMed Solutions', 'Lisa Brown', '+1-555-0104', 'lisa@techmed.com', '321 Tech Road, Innovation Hub, IH 22222');

-- Insert medical supplies
INSERT INTO medical_supplies (supply_name, category_id, supplier_id, unit_price, current_stock, minimum_stock, expiry_date, batch_number, description) VALUES
('Surgical Masks', 1, 1, 0.75, 150, 100, '2025-12-31', 'SM2024001', 'Disposable surgical masks for medical procedures'),
('Disposable Gloves', 1, 2, 0.25, 45, 50, '2025-08-15', 'DG2024001', 'Latex-free disposable examination gloves'),
('Insulin Syringes', 2, 3, 1.50, 200, 75, '2026-03-20', 'IS2024001', '1ml insulin syringes with fine needle'),
('Bandages', 3, 1, 2.00, 25, 30, '2027-01-10', 'BD2024001', 'Sterile adhesive bandages various sizes'),
('Digital Thermometers', 4, 4, 15.00, 80, 20, '2028-06-30', 'DT2024001', 'Digital thermometers for temperature measurement');

-- Insert sample users
INSERT INTO users (username, password_hash, full_name, email, role) VALUES
('admin', '$2y$10$example_hash_here', 'System Administrator', 'admin@hospital.com', 'Admin'),
('manager1', '$2y$10$example_hash_here', 'Jane Manager', 'jane@hospital.com', 'Manager'),
('staff1', '$2y$10$example_hash_here', 'Bob Staff', 'bob@hospital.com', 'Staff');

-- Create useful views

-- Low stock alert view
CREATE VIEW low_stock_alerts AS
SELECT 
    ms.supply_id,
    ms.supply_name,
    c.category_name,
    s.supplier_name,
    ms.current_stock,
    ms.minimum_stock,
    ms.unit_price,
    ms.expiry_date,
    CASE 
        WHEN ms.current_stock <= ms.minimum_stock THEN 'Critical'
        WHEN ms.current_stock <= (ms.minimum_stock * 1.2) THEN 'Warning'
        ELSE 'Normal'
    END as stock_status
FROM medical_supplies ms
JOIN categories c ON ms.category_id = c.category_id
JOIN suppliers s ON ms.supplier_id = s.supplier_id
WHERE ms.status = 'Active'
ORDER BY ms.current_stock ASC;

-- Expiring supplies view (expires within 30 days)
CREATE VIEW expiring_supplies AS
SELECT 
    ms.supply_id,
    ms.supply_name,
    c.category_name,
    s.supplier_name,
    ms.current_stock,
    ms.expiry_date,
    DATEDIFF(ms.expiry_date, CURDATE()) as days_to_expiry
FROM medical_supplies ms
JOIN categories c ON ms.category_id = c.category_id
JOIN suppliers s ON ms.supplier_id = s.supplier_id
WHERE ms.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    AND ms.status = 'Active'
    AND ms.current_stock > 0
ORDER BY ms.expiry_date ASC;

-- Inventory value view
CREATE VIEW inventory_value AS
SELECT 
    ms.supply_id,
    ms.supply_name,
    c.category_name,
    ms.current_stock,
    ms.unit_price,
    (ms.current_stock * ms.unit_price) as total_value
FROM medical_supplies ms
JOIN categories c ON ms.category_id = c.category_id
WHERE ms.status = 'Active'
ORDER BY total_value DESC;

-- Create indexes for better performance
CREATE INDEX idx_supplies_category ON medical_supplies(category_id);
CREATE INDEX idx_supplies_supplier ON medical_supplies(supplier_id);
CREATE INDEX idx_supplies_expiry ON medical_supplies(expiry_date);
CREATE INDEX idx_supplies_stock ON medical_supplies(current_stock);
CREATE INDEX idx_transactions_supply ON stock_transactions(supply_id);
CREATE INDEX idx_transactions_date ON stock_transactions(transaction_date);

-- Sample queries for common operations

-- Check low stock items
-- SELECT * FROM low_stock_alerts WHERE stock_status IN ('Critical', 'Warning');

-- Get total inventory value
-- SELECT SUM(total_value) as total_inventory_value FROM inventory_value;

-- Find supplies expiring soon
-- SELECT * FROM expiring_supplies WHERE days_to_expiry <= 7;

-- Get stock transaction history for a specific supply
-- SELECT st.*, ms.supply_name 
-- FROM stock_transactions st
-- JOIN medical_supplies ms ON st.supply_id = ms.supply_id
-- WHERE st.supply_id = 1
-- ORDER BY st.transaction_date DESC;
