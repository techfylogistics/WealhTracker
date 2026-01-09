CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Enable dev seeding
INSERT OR IGNORE INTO app_config (key, value)
VALUES ('DEV_SEED_ENABLED', 'true');
INSERT OR IGNORE INTO financial_nature (code, networth_sign)
VALUES
('ASSET', 1),
('LIABILITY', -1);
-- ROOT CATEGORIES
INSERT OR IGNORE INTO category (id, name, parent_id, nature_code) VALUES
(1, 'Assets', NULL, 'ASSET'),
(2, 'Liabilities', NULL, 'LIABILITY');

-- ASSET CHILDREN
INSERT OR IGNORE INTO category (id, name, parent_id, nature_code) VALUES
(10, 'Real Estate', 1, 'ASSET'),
(11, 'Stocks', 1, 'ASSET'),
(12, 'Gold', 1, 'ASSET'),
(13, 'Bank Deposits', 1, 'ASSET'),
(14, 'Retirement Funds', 1, 'ASSET');

-- GOLD SUB-CATEGORIES
INSERT OR IGNORE INTO category (id, name, parent_id, nature_code) VALUES
(120, 'Gold Jewellery', 12, 'ASSET'),
(121, 'Gold Bonds', 12, 'ASSET');

-- LIABILITY CHILDREN
INSERT OR IGNORE INTO category (id, name, parent_id, nature_code) VALUES
(20, 'Loans', 2, 'LIABILITY');
INSERT OR IGNORE INTO category_capability VALUES
(10, 1,1,1,1,0), -- Real Estate
(11, 0,0,1,1,1), -- Stocks
(12, 1,1,1,1,0), -- Gold
(13, 0,0,1,1,0), -- Bank
(14, 0,0,1,1,0), -- Retirement
(20, 0,0,1,1,0); -- Loans
INSERT OR IGNORE INTO ui_behavior VALUES
(10, 1,0,0),
(11, 0,0,1),
(12, 1,0,0),
(13, 0,1,0),
(20, 0,0,0);
INSERT OR IGNORE INTO item (id, category_id, name, description)
VALUES
(100, 10, 'Hyderabad Apartment', '2BHK apartment in Gachibowli'),
(101, 11, 'Equity Portfolio', 'Zerodha long term holdings'),
(102, 120, 'Gold Necklace', '22K wedding jewellery'),
(103, 13, 'HDFC Fixed Deposit', '5 year FD'),
(104, 14, 'EPF Account', 'Employee provident fund'),
(200, 20, 'Home Loan - SBI', 'Housing loan');
INSERT OR IGNORE INTO metadata_definition VALUES
('purchase_date','Purchase Date','DATE',10,1,1),
('purchase_price','Purchase Price','NUMBER',10,1,2),
('location','Location','LOCATION',10,1,3),

('ticker','Stock Ticker','TEXT',11,1,1),
('quantity','Quantity','NUMBER',11,1,2),

('grams','Weight (grams)','NUMBER',12,1,1),
('interest_rate','Interest Rate','NUMBER',13,1,1);
INSERT OR IGNORE INTO item_metadata (item_id, meta_key, meta_value)
VALUES
(100,'purchase_date','2018-06-10'),
(100,'purchase_price','8500000'),
(100,'location','Gachibowli, Hyderabad'),

(101,'ticker','NIFTY50'),
(101,'quantity','120'),

(102,'grams','120'),

(103,'interest_rate','6.8');
INSERT OR IGNORE INTO transaction_type VALUES
('BUY','Investment Buy',1,0,0,1,1,'INVESTMENT'),
('SELL','Investment Sell',1,0,0,1,1,'RETURN'),
('INTEREST','Interest Income',1,1,0,1,1,'RETURN'),
('EMI','Loan EMI',1,0,1,1,1,'EXPENSE'),
('VALUATION','Market Valuation',0,0,0,0,1,'VALUATION');
-- Real Estate purchase
INSERT OR IGNORE INTO transactions (item_id, txn_date, amount, txn_type_code)
VALUES
(100,'2018-06-10',-8500000,'BUY');

-- Stock investments
INSERT OR IGNORE INTO transactions VALUES
(NULL,101,'2020-01-15',-500000,'BUY','Initial investment'),
(NULL,101,'2023-12-31',120000,'INTEREST','Dividends');

-- Gold purchase
INSERT OR IGNORE INTO transactions VALUES
(NULL,102,'2019-05-20',-600000,'BUY','Gold purchase');

-- FD interest
INSERT OR IGNORE INTO transactions VALUES
(NULL,103,'2024-03-31',45000,'INTEREST','FD yearly interest');

-- Loan EMI
INSERT OR IGNORE INTO transactions VALUES
(NULL,200,'2024-01-05',-45000,'EMI','Home loan EMI');
INSERT OR REPLACE INTO item_current_value VALUES
(100,12000000,'2024-12-01'),
(101,780000,'2024-12-01'),
(102,720000,'2024-12-01'),
(103,650000,'2024-12-01'),
(104,900000,'2024-12-01'),
(200,4500000,'2024-12-01');
INSERT OR REPLACE INTO networth_snapshot VALUES
('2024-12-01',15350000,4500000,10850000);

INSERT OR REPLACE INTO networth_trend VALUES
('2024-10-01',10100000),
('2024-11-01',10500000),
('2024-12-01',10850000);
