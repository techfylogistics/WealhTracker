import { CategoryQueryRepository } from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteCategoryQueryRepository
  implements CategoryQueryRepository {

  async getLeafCategories(): Promise<number[]> {
    const rows = await query<{ id: number }>(
      `
      SELECT c.id
      FROM category c
      LEFT JOIN category child
        ON child.parent_id = c.id
      WHERE child.id IS NULL
      `
    );
    return rows.map(r => r.id);
  }

  async getCategoryTree(): Promise<Array<{
    id: number;
    name: string;
    parentId: number | null;
    natureCode: 'ASSET' | 'LIABILITY';
  }>> {
    return query(
      `
      SELECT
        id,
        name,
        parent_id AS parentId,
        nature_code AS natureCode
      FROM category
      ORDER BY parent_id, name
      `
    );
  }

  async getCategoryNetworthSnapshot(
    snapshotDate: string
  ): Promise<Array<{ categoryId: number; value: number }>> {
    return query(
      `
      SELECT
        category_id AS categoryId,
        value
      FROM category_networth_snapshot
      WHERE snapshot_date = ?
      `,
      [snapshotDate]
    );
  }
}
/* =========================================================
   IMPORT PROFILES (DATA INGESTION CONFIG)
   ========================================================= */

export interface ImportProfile {
  code: string;
  label: string;
  categoryId: number;
  supportedFormats?: string;
}

export interface ImportProfileRepository {

  getByCode(code: string): Promise<ImportProfile | null>;

  listByCategory(categoryId: number): Promise<ImportProfile[]>;

  listAll(): Promise<ImportProfile[]>;
}

