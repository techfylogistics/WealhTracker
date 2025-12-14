import {
  MetadataRepository,
  MetadataDefinition,
  ItemMetadata
} from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteMetadataRepository implements MetadataRepository {

  async getDefinitionsForCategory(
    categoryId: number
  ): Promise<MetadataDefinition[]> {
    return query<MetadataDefinition>(
      `
      WITH RECURSIVE ancestors AS (
        SELECT id FROM category WHERE id = ?
        UNION ALL
        SELECT c.parent_id
        FROM category c
        JOIN ancestors a ON a.id = c.id
        WHERE c.parent_id IS NOT NULL
      )
      SELECT
        md.key,
        md.label,
        md.data_type AS dataType,
        md.applicable_category_id AS applicableCategoryId,
        md.is_required AS isRequired,
        md.display_order AS displayOrder
      FROM metadata_definition md
      WHERE md.applicable_category_id IS NULL
         OR md.applicable_category_id IN (SELECT id FROM ancestors)
      ORDER BY md.display_order
      `,
      [categoryId]
    );
  }

  async getItemMetadata(itemId: number): Promise<ItemMetadata[]> {
    return query<ItemMetadata>(
      `
      SELECT
        item_id AS itemId,
        meta_key AS key,
        meta_value AS value
      FROM item_metadata
      WHERE item_id = ?
      `,
      [itemId]
    );
  }

  async saveItemMetadata(
    itemId: number,
    values: ItemMetadata[]
  ): Promise<void> {
    await execute(
      `DELETE FROM item_metadata WHERE item_id = ?`,
      [itemId]
    );

    for (const meta of values) {
      await execute(
        `
        INSERT INTO item_metadata (
          item_id,
          meta_key,
          meta_value
        )
        VALUES (?, ?, ?)
        `,
        [
          itemId,
          meta.key,
          meta.value ?? null
        ]
      );
    }
  }
}
