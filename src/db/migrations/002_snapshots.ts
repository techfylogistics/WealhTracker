import { Migration } from './types';

export const migration_002: Migration = {
  version: 2,
  name: 'performance_snapshots',
  up: `
    CREATE TABLE IF NOT EXISTS networth_snapshot (
      snapshot_date DATE PRIMARY KEY,
      total_assets REAL NOT NULL,
      total_liabilities REAL NOT NULL,
      networth REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS networth_trend (
      date DATE PRIMARY KEY,
      networth REAL NOT NULL
    );
  `,
};
