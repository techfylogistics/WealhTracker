PRAGMA foreign_keys = ON;

------------------------------------------------------------------
-- 1. FINANCIAL NATURE
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  financial_nature (
    code TEXT PRIMARY KEY,           -- ASSET / LIABILITY
    networth_sign INTEGER NOT NULL   -- +1 asset, -1 liability
);

------------------------------------------------------------------
-- 2. HIERARCHICAL CATEGORY (ADJACENCY LIST)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,               -- NULL for root categories
    nature_code TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES category(id),
    FOREIGN KEY (nature_code) REFERENCES financial_nature(code)
);

CREATE INDEX IF NOT EXISTS   idx_category_parent ON category(parent_id);

------------------------------------------------------------------
-- 3. CATEGORY CAPABILITIES (INHERITABLE)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  category_capability (
    category_id INTEGER PRIMARY KEY,
    supports_location INTEGER NOT NULL,
    supports_documents INTEGER NOT NULL,
    supports_returns INTEGER NOT NULL,
    supports_valuation INTEGER NOT NULL,
    supports_import INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

------------------------------------------------------------------
-- 4. UI BEHAVIOR (INHERITABLE)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  ui_behavior (
    category_id INTEGER PRIMARY KEY,
    show_map_picker INTEGER NOT NULL,
    show_sms_balance INTEGER NOT NULL,
    show_import INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

------------------------------------------------------------------
-- 5. ITEM (ASSET / LIABILITY / INSURANCE)
-- Rule: item.category_id must point to a LEAF category
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    currency TEXT DEFAULT 'INR',
    is_cash INTEGER DEFAULT 0,
    created_at DATE DEFAULT CURRENT_DATE,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE INDEX IF NOT EXISTS   idx_item_category ON item(category_id);

------------------------------------------------------------------
-- 6. METADATA DEFINITIONS (DRIVES FORMS)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  metadata_definition (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    data_type TEXT CHECK (
        data_type IN ('TEXT','NUMBER','DATE','BOOLEAN','LOCATION','FILE')
    ) NOT NULL,
    applicable_category_id INTEGER,   -- applies to this category & its children
    is_required INTEGER NOT NULL,
    display_order INTEGER,
    FOREIGN KEY (applicable_category_id) REFERENCES category(id)
);

CREATE TABLE  IF NOT EXISTS  item_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    meta_key TEXT NOT NULL,
    meta_value TEXT,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (meta_key) REFERENCES metadata_definition(key)
);

CREATE INDEX IF NOT EXISTS   idx_item_metadata_item ON item_metadata(item_id);

------------------------------------------------------------------
-- 7. CONTACTS & ROLES
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT CHECK (
        category IN ('INDIVIDUAL','FINANCIAL_INSTITUTE','GOVT')
    ) NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT
);

CREATE TABLE  IF NOT EXISTS  contact_role (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    applicable_category_id INTEGER,
    FOREIGN KEY (applicable_category_id) REFERENCES category(id)
);

CREATE TABLE  IF NOT EXISTS  item_contact (
    item_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    role_code TEXT NOT NULL,
    PRIMARY KEY (item_id, contact_id, role_code),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (contact_id) REFERENCES contact(id),
    FOREIGN KEY (role_code) REFERENCES contact_role(code)
);

------------------------------------------------------------------
-- 8. DOCUMENT TYPES & DOCUMENTS
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  document_type (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    applicable_category_id INTEGER,
    is_mandatory INTEGER NOT NULL,
    FOREIGN KEY (applicable_category_id) REFERENCES category(id)
);

CREATE TABLE  IF NOT EXISTS  document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    doc_type_code TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (doc_type_code) REFERENCES document_type(code)
);

CREATE INDEX IF NOT EXISTS   idx_document_item ON document(item_id);

------------------------------------------------------------------
-- 9. TRANSACTION TYPE MASTER (SEMANTIC RULES)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  transaction_type (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,

    is_cashflow INTEGER NOT NULL,
    is_return INTEGER NOT NULL,
    is_expense INTEGER NOT NULL,

    affects_xirr INTEGER NOT NULL,
    affects_networth INTEGER NOT NULL,

    group_code TEXT CHECK (
        group_code IN ('INVESTMENT','RETURN','EXPENSE','VALUATION','TRANSFER')
    ) NOT NULL
);

------------------------------------------------------------------
-- 10. TRANSACTIONS
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  transaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    txn_date DATE NOT NULL,
    amount REAL NOT NULL,          -- SIGNED (+ inflow, - outflow)
    txn_type_code TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (txn_type_code) REFERENCES transaction_type(code)
);

CREATE INDEX IF NOT EXISTS   idx_txn_item_date
    ON transaction(item_id, txn_date);

CREATE INDEX IF NOT EXISTS   idx_txn_type_date
    ON transaction(txn_type_code, txn_date);

------------------------------------------------------------------
-- 11. VALUATION POLICY (INHERITABLE)
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  valuation_policy (
    category_id INTEGER PRIMARY KEY,
    valuation_frequency TEXT CHECK (
        valuation_frequency IN ('DAILY','MONTHLY','MANUAL')
    ) NOT NULL,
    allow_manual_override INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

------------------------------------------------------------------
-- 12. IMPORT PROFILES
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  import_profile (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    supported_formats TEXT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

------------------------------------------------------------------
-- 13. PERFORMANCE CACHE TABLES (READ-OPTIMIZED)
------------------------------------------------------------------

-- Latest value per item
CREATE TABLE  IF NOT EXISTS  item_current_value (
    item_id INTEGER PRIMARY KEY,
    value REAL NOT NULL,
    last_updated DATE NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id)
);

-- Per-item financial summary
CREATE TABLE  IF NOT EXISTS  item_financial_summary (
    item_id INTEGER PRIMARY KEY,
    total_invested REAL NOT NULL,
    total_returns REAL NOT NULL,
    total_expenses REAL NOT NULL,
    net_gain REAL NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id)
);

-- Overall net worth snapshot
CREATE TABLE  IF NOT EXISTS  networth_snapshot (
    snapshot_date DATE PRIMARY KEY,
    total_assets REAL NOT NULL,
    total_liabilities REAL NOT NULL,
    networth REAL NOT NULL
);

-- Category-level net worth snapshot
CREATE TABLE  IF NOT EXISTS  category_networth_snapshot (
    snapshot_date DATE NOT NULL,
    category_id INTEGER NOT NULL,
    value REAL NOT NULL,
    PRIMARY KEY (snapshot_date, category_id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Net worth trend
CREATE TABLE  IF NOT EXISTS  networth_trend (
    date DATE PRIMARY KEY,
    networth REAL NOT NULL
);

-- XIRR cache
CREATE TABLE  IF NOT EXISTS   xirr_cache (
    scope_type TEXT CHECK (
        scope_type IN ('ITEM','CATEGORY','OVERALL')
    ),
    scope_id INTEGER,
    xirr REAL,
    last_computed DATE,
    PRIMARY KEY (scope_type, scope_id)
);

------------------------------------------------------------------
-- 14. BACKUP LOG
------------------------------------------------------------------

CREATE TABLE  IF NOT EXISTS  backup_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_date DATE DEFAULT CURRENT_DATE,
    file_path TEXT NOT NULL
);
------------------------------------------------------------------
-- 15. MIGRATION SYSTEM
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS   schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at DATE DEFAULT CURRENT_DATE
);
