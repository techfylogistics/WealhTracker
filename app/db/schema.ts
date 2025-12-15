import { getDb, execute } from './sqlite';
import { wealthtrackerSchema } from './wealthtracker';

function cleanSql(sql: string): string[] {
  return sql
    // remove line comments
    .replace(/--.*$/gm, '')
    // remove block comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();

  // ✅ PRAGMA must be executed alone
  await db.execAsync(`PRAGMA foreign_keys = ON`);
  const statements = cleanSql(wealthtrackerSchema);


  // const statements = CleanSQLstatements
  //   .split(';')
  //   .map(s => s.trim())
  //   .filter(s => s.length > 0);

  for (const stmt of statements) {
      // console.log("sql statement",stmt);
    await execute(stmt);
  }
}
