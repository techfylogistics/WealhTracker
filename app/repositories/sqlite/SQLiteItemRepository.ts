import { ItemRepository, Item } from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteItemRepository implements ItemRepository {

  async create(item: Omit<Item, 'id' | 'createdAt'>): Promise<number> {
    await execute(
      `INSERT INTO item (category_id, name, description, currency, is_cash, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.categoryId,
        item.name,
        item.description ?? null,
        item.currency,
        item.isCash ? 1 : 0,
        item.isActive ? 1 : 0
      ]
    );

    const rows = await query<{ id: number }>(
      `SELECT last_insert_rowid() AS id`
    );
    return rows[0].id;
  }

  async update(item: Item): Promise<void> {
    await execute(
      `UPDATE item
       SET category_id = ?, name = ?, description = ?, currency = ?, is_cash = ?, is_active = ?
       WHERE id = ?`,
      [
        item.categoryId,
        item.name,
        item.description ?? null,
        item.currency,
        item.isCash ? 1 : 0,
        item.isActive ? 1 : 0,
        item.id
      ]
    );
  }

  async delete(itemId: number): Promise<void> {
    await execute(`UPDATE item SET is_active = 0 WHERE id = ?`, [itemId]);
  }

  async getById(itemId: number): Promise<Item | null> {
    const rows = await query<Item>(
      `SELECT
         id,
         category_id AS categoryId,
         name,
         description,
         currency,
         is_cash AS isCash,
         is_active AS isActive,
         created_at AS createdAt
       FROM item WHERE id = ?`,
      [itemId]
    );
    return rows[0] ?? null;
  }

  async listByCategory(categoryId: number): Promise<Item[]> {
    return query<Item>(
      `SELECT id, category_id AS categoryId, name, description, currency,
              is_cash AS isCash, is_active AS isActive, created_at AS createdAt
       FROM item WHERE category_id = ? AND is_active = 1`,
      [categoryId]
    );
  }

  async listAllActive(): Promise<Item[]> {
    return query<Item>(
      `SELECT id, category_id AS categoryId, name, description, currency,
              is_cash AS isCash, is_active AS isActive, created_at AS createdAt
       FROM item WHERE is_active = 1`
    );
  }
}
