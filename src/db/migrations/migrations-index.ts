import { migration_001 } from './001_init';
import { migration_002 } from './002_snapshots';
import { Migration } from './types';

export const migrations: Migration[] = [
  migration_001,
  migration_002,
].sort((a, b) => a.version - b.version);
