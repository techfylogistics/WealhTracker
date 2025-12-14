import { MetadataDefinition } from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteMetadataDefinitionRepository {

  async getByKey(key: string): Promise<MetadataDefinition | null> {
    const rows = await query<MetadataDefinition>(
      `
      SELECT
        key,
        label,
        data_type AS dataType,
        applicable_category_id AS applicableCategoryId,
        is_required AS isRequired,
        display_order AS displayOrder
      FROM metadata_definition
      WHERE key = ?
      `,
      [key]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<MetadataDefinition[]> {
    return query<MetadataDefinition>(
      `
      SELECT
        key,
        label,
        data_type AS dataType,
        applicable_category_id AS applicableCategoryId,
        is_required AS isRequired,
        display_order AS displayOrder
      FROM metadata_definition
      ORDER BY display_order
      `
    );
  }
}
