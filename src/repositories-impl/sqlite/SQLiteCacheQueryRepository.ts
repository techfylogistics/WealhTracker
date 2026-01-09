import { XIRRbyScope } from '@//query-models/XirrView';
import { CacheQueryRepository } from '../../domain/repositories/repositories-index';
import { query } from '../../db/sqlite';

export class SQLiteCacheQueryRepository implements CacheQueryRepository {

  async getLatestNetworth() {
    console.log("in getLatestNetworth in repo ")
    const rows = await query<any>(
      `SELECT * FROM networth_snapshot ORDER BY snapshot_date DESC LIMIT 1`
    );
    console.log("in getLatestNetworth in repo, rows returned ", rows[0]);

    return rows[0] ?? null;
  }
  async getNetworthSnapshot(date: string) {
    return query<{ value: number }>(
      `SELECT category_id AS categoryId, value
       FROM category_networth_snapshot
       WHERE snapshot_date = ?`,
      [date]
    );
  }
  async getCategorySnapshot(date: string) {
    return query<{ categoryId: number; value: number }>(
      `SELECT category_id AS categoryId, value
       FROM category_networth_snapshot
       WHERE snapshot_date = ?`,
      [date]
    );
  }
  async getLatestCategoryNetworth() {
    const rows = await query<{ categoryId: number; value: number }>(
      'SELECT   cns.category_id as categoryId,cns.value as value FROM category_networth_snapshot cns WHERE cns.snapshot_date = (SELECT MAX(snapshot_date)FROM category_networth_snapshot   WHERE category_id = cns.category_id');

    return rows ?? null;

  }

  async getItemSummary(itemId: number) {
    const rows = await query<any>(
      `SELECT * FROM item_financial_summary WHERE item_id = ?`,
      [itemId]
    );
    return rows[0] ?? null;
  }
  async getItemCurrentValue(itemId: number) {
    const rows = await query<{ value: number } | null>(
      `SELECT value FROM item_current_value WHERE item_id = ? DESC LIMIT 1`,
      [itemId]
    );
    return rows[0] ?? null;
  }

  async getXirr(scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL', scopeId?: number): Promise<number | null> {
    const rows = await query<any>(
      `SELECT xirr FROM xirr_cache
       WHERE scope_type = ? AND scope_id IS ?`,
      [scopeType, scopeId ?? null]
    );
    return rows[0]?.xirr ?? null;
  }


  async getAllXirr(scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL'): Promise<XIRRbyScope[] | null> {
    const rows = await query<any>(
      `SELECT scope_type as scopeType, scopeId ,xirr FROM xirr_cache
       WHERE scope_type = ? `,
      [scopeType]
    );
    return rows ?? [];
  }
}
