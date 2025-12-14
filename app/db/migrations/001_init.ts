import { Migration } from './types';

export const migration_001: Migration = {
  version: 1,
  name: 'initial_schema',
  up: `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS financial_nature (
      code TEXT PRIMARY KEY,
      networth_sign INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER,
      nature_code TEXT NOT NULL,
      FOREIGN KEY (parent_id) REFERENCES category(id),
      FOREIGN KEY (nature_code) REFERENCES financial_nature(code)
    );

    CREATE INDEX IF NOT EXISTS idx_category_parent ON category(parent_id);

    /* add rest of base schema here */
  `,
};
