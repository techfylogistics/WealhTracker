import * as SQLite from 'expo-sqlite';
import { migrations } from './migrations';

const db = SQLite.openDatabase('wealthtracker.db');

export function runMigrations() {
  db.transaction(tx => {
    // Ensure migration table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATE DEFAULT CURRENT_DATE
      );
    `);

    // Fetch applied migrations
    tx.executeSql(
      `SELECT version FROM schema_migrations`,
      [],
      (_, result) => {
        const applied = new Set<number>();
        for (let i = 0; i < result.rows.length; i++) {
          applied.add(result.rows.item(i).version);
        }

        // Apply pending migrations
        migrations.forEach(migration => {
          if (applied.has(migration.version)) return;

          console.log(`⬆ Applying migration ${migration.version}: ${migration.name}`);

          tx.executeSql(migration.up);

          tx.executeSql(
            `INSERT INTO schema_migrations (version, name)
             VALUES (?, ?)`,
            [migration.version, migration.name]
          );
        });
      }
    );
  });
}
