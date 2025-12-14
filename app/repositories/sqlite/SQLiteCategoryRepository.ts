import { CategoryRepository, Category } from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteCategoryRepository implements CategoryRepository {

  async getById(id: number): Promise<Category | null> {
    const rows = await query<Category>(
      `SELECT id, name, parent_id AS parentId, nature_code AS natureCode
       FROM category WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }

  async getChildren(parentId: number | null): Promise<Category[]> {
    return query<Category>(
      `SELECT id, name, parent_id AS parentId, nature_code AS natureCode
       FROM category WHERE parent_id IS ?`,
      [parentId]
    );
  }

  async getAncestors(categoryId: number): Promise<Category[]> {
    return query<Category>(
      `
      WITH RECURSIVE ancestors AS (
        SELECT id, name, parent_id AS parentId, nature_code AS natureCode
        FROM category WHERE id = ?
        UNION ALL
        SELECT c.id, c.name, c.parent_id, c.nature_code
        FROM category c
        JOIN ancestors a ON a.parentId = c.id
      )
      SELECT * FROM ancestors WHERE id != ?;
      `,
      [categoryId, categoryId]
    );
  }

  async getDescendants(categoryId: number): Promise<Category[]> {
    return query<Category>(
      `
      WITH RECURSIVE descendants AS (
        SELECT id, name, parent_id AS parentId, nature_code AS natureCode
        FROM category WHERE parent_id = ?
        UNION ALL
        SELECT c.id, c.name, c.parent_id, c.nature_code
        FROM category c
        JOIN descendants d ON d.id = c.parent_id
      )
      SELECT * FROM descendants;
      `,
      [categoryId]
    );
  }

  async isLeaf(categoryId: number): Promise<boolean> {
    const rows = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM category WHERE parent_id = ?`,
      [categoryId]
    );
    return rows[0].count === 0;
  }
}
