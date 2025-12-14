import { execute } from './sqlite';
// import wealthtrackerSchema from './wealthtracker.sql';
// const wealthtrackerSchema: string = require('./wealthtracker.sql');
const wealthtrackerSchema: string = require('./test.txt');

/**
 * Runs schema creation statements
 */
export async function initializeDatabase(): Promise<void> {
  const statements = wealthtrackerSchema
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await execute(stmt);
  }
}
