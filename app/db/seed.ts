import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { getDb,execute,query} from './sqlite';


export async function seedDatabaseIfNeeded() {
  console.log("in seed db");
  if (!__DEV__) return;
  if (Platform.OS == 'web') return;
  console.log("starting to seed db");


  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS seed_log (
      seed_name TEXT PRIMARY KEY,
      applied_at DATE DEFAULT CURRENT_DATE
    );
  `);

  const existing = await db.getAllAsync(
    `SELECT 1 FROM seed_log WHERE seed_name = 'base_seed';`
  );

  if (existing.length > 0) {
    console.log('🌱 Seed already applied, skipping');
    return;
  }

  console.log('🌱 Running base seed');

  // 🚨 ONE TRANSACTION — CRITICAL
  await db.execAsync('BEGIN');

  try {
    // --------------------------------------------------
    // 1. FINANCIAL NATURE (MASTER)
    // --------------------------------------------------
    await db.execAsync(`
      INSERT OR IGNORE INTO financial_nature (code, networth_sign) VALUES
        ('ASSET', 1),
        ('LIABILITY', -1);
    `);

    // --------------------------------------------------
    // 2. CATEGORIES (MASTER)
    // --------------------------------------------------
    await db.execAsync(`
      INSERT OR IGNORE INTO category (id, name, parent_id, nature_code) VALUES
        (1, 'Assets', NULL, 'ASSET'),
        (2, 'Liabilities', NULL, 'LIABILITY'),
        (10, 'Real Estate', 1, 'ASSET'),
        (11, 'Stocks', 1, 'ASSET'),
        (12, 'Gold', 1, 'ASSET'),
        (13, 'Bank Deposits', 1, 'ASSET'),
        (14, 'Retirement Funds', 1, 'ASSET'),
        (20, 'Loans', 2, 'LIABILITY');
    `);

    // --------------------------------------------------
    // 3. TRANSACTION TYPES (MASTER)
    // --------------------------------------------------
    await db.execAsync(`
      INSERT OR IGNORE INTO transaction_type (
        code, label,
        is_cashflow, is_return, is_expense,
        affects_xirr, affects_networth,
        group_code
      ) VALUES
        ('BUY','Buy / Invest',1,0,0,1,1,'INVESTMENT'),
        ('SELL','Sell',1,1,0,1,1,'RETURN'),
        ('INTEREST','Interest',1,1,0,1,1,'RETURN'),
        ('DIVIDEND','Dividend',1,1,0,1,1,'RETURN'),
        ('EMI','Loan EMI',1,0,1,0,0,'EXPENSE'),
        ('FEE','Charges',1,0,1,0,0,'EXPENSE'),
        ('TRANSFER','Transfer',1,0,0,0,0,'TRANSFER');
    `);

    // --------------------------------------------------
    // 4. ITEMS (USER DATA)
    // --------------------------------------------------
    await db.execAsync(`
      INSERT INTO item (category_id, name, description) VALUES
        (10, 'Apartment', 'Primary residential apartment'),
        (11, 'Equity Portfolio', 'Long-term stock investments'),
        (12, 'Gold Holdings', 'Physical + digital gold'),
        (13, 'Fixed Deposit', 'Bank fixed deposits'),
        (20, 'Home Loan', 'Housing loan');
    `);

    // --------------------------------------------------
    // 5. RESOLVE ITEM IDS (MUST EXIST)
    // --------------------------------------------------
    const items = await db.getAllAsync<{ id: number; name: string }>(
      `SELECT id, name FROM item;`
    );

    const map: Record<string, number> = {};
    for (const i of items) map[i.name] = i.id;

    const required = [
      'Apartment',
      'Equity Portfolio',
      'Gold Holdings',
      'Fixed Deposit',
      'Home Loan',
    ];

    for (const name of required) {
      if (!map[name]) {
        throw new Error(`Missing seeded item: ${name}`);
      }
    }

    // --------------------------------------------------
    // 6. TRANSACTIONS (STRICT)
    // --------------------------------------------------
    await db.execAsync(`
      INSERT INTO transactions (item_id, txn_date, amount, txn_type_code, notes) VALUES
        (${map['Apartment']},        '2018-06-10', 8500000, 'BUY',      'Apartment purchase'),
        (${map['Equity Portfolio']}, '2020-01-15', 500000,  'BUY',      'Initial equity investment'),
        (${map['Equity Portfolio']}, '2023-12-31', 120000,  'DIVIDEND', 'Stock dividends'),
        (${map['Gold Holdings']},    '2019-05-20', 600000,  'BUY',      'Gold purchase'),
        (${map['Fixed Deposit']},    '2024-03-31', 45000,   'INTEREST', 'FD interest'),
        (${map['Home Loan']},        '2024-01-05', 45000,   'EMI',      'Home loan EMI');
    `);

    // --------------------------------------------------
    // 7. MARK SEED COMPLETE
    // --------------------------------------------------
    await db.execAsync(`
      INSERT INTO seed_log (seed_name) VALUES ('base_seed');
    `);

    await db.execAsync('COMMIT');
    console.log('🌱 Base seed completed successfully');

  } catch (e) {
    await db.execAsync('ROLLBACK');
    console.error('❌ Seed failed, rolled back', e);
    throw e;
  }
}

  
  
    
 

