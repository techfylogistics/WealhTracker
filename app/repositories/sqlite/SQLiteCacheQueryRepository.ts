import { CacheQueryRepository } from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteCacheQueryRepository implements CacheQueryRepository {

  async getLatestNetworth() {
    const rows = await query<any>(
      `SELECT * FROM networth_snapshot ORDER BY snapshot_date DESC LIMIT 1`
    );
    return rows[0] ?? null;
  }

  async getCategorySnapshot(date: string) {
    return query<{ categoryId: number; value: number }>(
      `SELECT category_id AS categoryId, value
       FROM category_networth_snapshot
       WHERE snapshot_date = ?`,
      [date]
    );
  }

  async getItemSummary(itemId: number) {
    const rows = await query<any>(
      `SELECT * FROM item_financial_summary WHERE item_id = ?`,
      [itemId]
    );
    return rows[0] ?? null;
  }

  async getXirr(scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL', scopeId?: number) {
    const rows = await query<any>(
      `SELECT xirr FROM xirr_cache
       WHERE scope_type = ? AND scope_id IS ?`,
      [scopeType, scopeId ?? null]
    );
    return rows[0]?.xirr ?? null;
  }
}
