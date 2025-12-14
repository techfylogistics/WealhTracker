import { Platform } from 'react-native';

let SQLite: any;

if (Platform.OS !== 'web') {
  SQLite = require('expo-sqlite');
}

let db: any = null;

if (Platform.OS !== 'web') {
  db = SQLite.openDatabase('wealthtracker.db');
}

export function execute(
  sql: string,
  params: any[] = []
): Promise<void> {
  if (Platform.OS === 'web') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function query<T>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  if (Platform.OS === 'web') {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, result: any) => {
          resolve(result.rows._array as T[]);
        },
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
