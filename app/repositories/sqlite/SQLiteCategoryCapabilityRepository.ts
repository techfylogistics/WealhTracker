import {
  CategoryCapabilityRepository,
  CategoryCapability
} from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteCategoryCapabilityRepository
  implements CategoryCapabilityRepository {

  async getByCategory(
    categoryId: number
  ): Promise<CategoryCapability | null> {
    const rows = await query<CategoryCapability>(
      `
      SELECT
        category_id AS categoryId,
        supports_location AS supportsLocation,
        supports_documents AS supportsDocuments,
        supports_returns AS supportsReturns,
        supports_valuation AS supportsValuation,
        supports_import AS supportsImport
      FROM category_capability
      WHERE category_id = ?
      `,
      [categoryId]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<CategoryCapability[]> {
    return query<CategoryCapability>(
      `
      SELECT
        category_id AS categoryId,
        supports_location AS supportsLocation,
        supports_documents AS supportsDocuments,
        supports_returns AS supportsReturns,
        supports_valuation AS supportsValuation,
        supports_import AS supportsImport
      FROM category_capability
      `
    );
  }
}
