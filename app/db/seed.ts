import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { getDb } from './sqlite';


export async function seedDatabaseIfNeeded() {
  console.log("in seed db");
  if (!__DEV__) return;
  if (Platform.OS == 'web') return;
  console.log("starting to seed db");

  const db = await getDb();

  // -----------------------------------------
  // 1. Seed log (idempotency)
  // -----------------------------------------
  db.execAsync(`
      CREATE TABLE IF NOT EXISTS seed_log (
        seed_name TEXT PRIMARY KEY,
        applied_at DATE DEFAULT CURRENT_DATE
      );
    `);
  const rows = (await db.getAllAsync(
    `SELECT 1 FROM seed_log WHERE seed_name = 'base_seed';`
  )) as any[];

  if (rows.length > 0) {
    console.log('🌱 Seed already exists, skipping');
    return;
  }



  console.log('🌱 Applying WealthTracker seed');

  // -----------------------------------------
  // 2. MASTER TABLES
  // -----------------------------------------
  db.execAsync(`
          INSERT OR IGNORE INTO financial_nature VALUES
            ('ASSET',1),
            ('LIABILITY',-1);
        `);

  db.execAsync(`
          INSERT OR IGNORE INTO category (id,name,parent_id,nature_code) VALUES
            (1,'Assets',NULL,'ASSET'),
            (2,'Liabilities',NULL,'LIABILITY'),
            (10,'Real Estate',1,'ASSET'),
            (11,'Stocks',1,'ASSET'),
            (12,'Gold',1,'ASSET'),
            (13,'Bank Deposits',1,'ASSET'),
            (14,'Retirement Funds',1,'ASSET'),
            (120,'Gold Jewellery',12,'ASSET'),
            (121,'Gold Bonds',12,'ASSET'),
            (20,'Loans',2,'LIABILITY');
        `);

  db.execAsync(`
          INSERT OR IGNORE INTO category_capability VALUES
            (10,1,1,1,1,0),
            (11,0,0,1,1,1),
            (12,1,1,1,1,0),
            (13,0,0,1,1,0),
            (14,0,0,1,1,0),
            (20,0,0,1,1,0);
        `);

  db.execAsync(`
          INSERT OR IGNORE INTO ui_behavior VALUES
            (10,1,0,0),
            (11,0,0,1),
            (12,1,0,0),
            (13,0,1,0),
            (20,0,0,0);
        `);

  // -----------------------------------------
  // 3. ITEMS
  // -----------------------------------------
  db.execAsync(`
          INSERT OR IGNORE INTO item (id,category_id,name,description) VALUES
            (100,10,'Hyderabad Apartment','2BHK in Gachibowli'),
            (101,11,'Equity Portfolio','Zerodha long term'),
            (102,120,'Gold Necklace','22K jewellery'),
            (103,13,'HDFC Fixed Deposit','5 year FD'),
            (104,14,'EPF Account','Provident fund'),
            (200,20,'Home Loan - SBI','Housing loan');
        `);

  // -----------------------------------------
  // 4. METADATA
  // -----------------------------------------
  db.execAsync(`
          INSERT OR IGNORE INTO metadata_definition VALUES
            ('purchase_date','Purchase Date','DATE',10,1,1),
            ('purchase_price','Purchase Price','NUMBER',10,1,2),
            ('location','Location','LOCATION',10,1,3),
            ('ticker','Stock Ticker','TEXT',11,1,1),
            ('quantity','Quantity','NUMBER',11,1,2),
            ('grams','Weight (grams)','NUMBER',12,1,1),
            ('interest_rate','Interest Rate','NUMBER',13,1,1);
        `);

  db.execAsync(`
          INSERT OR IGNORE INTO item_metadata (item_id,meta_key,meta_value) VALUES
            (100,'purchase_date','2018-06-10'),
            (100,'purchase_price','8500000'),
            (100,'location','Gachibowli, Hyderabad'),
            (101,'ticker','NIFTY50'),
            (101,'quantity','120'),
            (102,'grams','120'),
            (103,'interest_rate','6.8');
        `);

  // -----------------------------------------
  // 5. TRANSACTIONS
  // -----------------------------------------
  db.execAsync(`
          INSERT OR IGNORE INTO transactions (item_id,txn_date,amount,txn_type_code,notes) VALUES
            (100,'2018-06-10',-8500000,'BUY','Apartment purchase'),
            (101,'2020-01-15',-500000,'BUY','Initial equity buy'),
            (101,'2023-12-31',120000,'INTEREST','Dividends'),
            (102,'2019-05-20',-600000,'BUY','Gold purchase'),
            (103,'2024-03-31',45000,'INTEREST','FD interest'),
            (200,'2024-01-05',-45000,'EMI','Home loan EMI');
        `);

  // -----------------------------------------
  // 6. SNAPSHOTS (REPLACE is OK)
  // -----------------------------------------
  db.execAsync(`
          INSERT OR REPLACE INTO item_current_value VALUES
            (100,12000000,'2024-12-01'),
            (101,780000,'2024-12-01'),
            (102,720000,'2024-12-01'),
            (103,650000,'2024-12-01'),
            (104,900000,'2024-12-01'),
            (200,4500000,'2024-12-01');
        `);

  db.execAsync(`
          INSERT OR REPLACE INTO networth_snapshot VALUES
            ('2024-12-01',15350000,4500000,10850000);
        `);

  db.execAsync(`
          INSERT OR REPLACE INTO networth_trend VALUES
            ('2024-10-01',10100000),
            ('2024-11-01',10500000),
            ('2024-12-01',10850000);
        `);

  // -----------------------------------------
  // 7. MARK SEED DONE
  // -----------------------------------------
  db.execAsync(
    `INSERT INTO seed_log (seed_name) VALUES ('base_seed');`
  );

  console.log('✅ WealthTracker seed applied safely');
}
    
 

