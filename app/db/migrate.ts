import { getDb } from './sqlite';
import { migrations } from './migrations';

export async function runMigrations() {
  const db = await getDb();

  // 1. Ensure migration table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at DATE DEFAULT CURRENT_DATE
    );
  `);

  // 2. Get applied migrations
const rows = (await db.getAllAsync(
  `SELECT version FROM schema_migrations;`
)) as { version: number }[];

  const applied = new Set(rows.map(r => r.version));

  // 3. Apply pending migrations
  for (const migration of migrations) {
    if (applied.has(migration.version)) continue;

    console.log(`⬆ Applying migration ${migration.version}: ${migration.name}`);

    await db.execAsync(migration.up);

    await db.runAsync(
      `INSERT INTO schema_migrations (version, name)
       VALUES (?, ?)`,
      [migration.version, migration.name]
    );
  }
}
