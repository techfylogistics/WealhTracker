import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get (or create) the SQLite database instance
 */
export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (Platform.OS === 'web') {
    throw new Error('SQLite is not supported on web');
  }

  if (!db) {
    db = await SQLite.openDatabaseAsync('wealthtracker.db');
  }

  return db;
}

/**
 * Execute a SQL statement (CREATE / INSERT / UPDATE / DELETE)
 */
export async function execute(
  sql: string,
  params: any[] = []
): Promise<void> {
  if (Platform.OS === 'web') return;

  const database = await getDb();
  await database.runAsync(sql, params);
}

/**
 * Query rows from SQLite
 */
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  if (Platform.OS === 'web') return [];

  const database = await getDb();
  return (await database.getAllAsync(sql, params)) as T[];
}
