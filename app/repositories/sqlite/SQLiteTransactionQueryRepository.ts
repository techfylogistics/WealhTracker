import {
  TransactionQueryRepository,
  TransactionGroup
} from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteTransactionQueryRepository
  implements TransactionQueryRepository {
  sumByItemAndType(itemId: number, txnTypeCodes: string[]): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async getItemFinancialBreakdown(itemId: number) {
    const rows = await query<{
      invested: number;
      returns: number;
      expenses: number;
    }>(
      `
      SELECT
        SUM(CASE WHEN tt.group_code = 'INVESTMENT' THEN ABS(t.amount) ELSE 0 END) AS invested,
        SUM(CASE WHEN tt.group_code = 'RETURN' THEN t.amount ELSE 0 END) AS returns,
        SUM(CASE WHEN tt.group_code = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END) AS expenses
      FROM transactions t
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE t.item_id = ?
      `,
      [itemId]
    );

    return rows[0] ?? { invested: 0, returns: 0, expenses: 0 };
  }

  async sumForNetworth() {
    const rows = await query<{
      assets: number;
      liabilities: number;
    }>(
      `
      SELECT
        SUM(CASE WHEN fn.networth_sign = 1 THEN t.amount ELSE 0 END) AS assets,
        SUM(CASE WHEN fn.networth_sign = -1 THEN t.amount ELSE 0 END) AS liabilities
      FROM transactions t
      JOIN item i ON t.item_id = i.id
      JOIN category c ON i.category_id = c.id
      JOIN financial_nature fn ON c.nature_code = fn.code
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE tt.affects_networth = 1
      `
    );

    return rows[0] ?? { assets: 0, liabilities: 0 };
  }

  async networthTrend() {
    return query<{ date: string; value: number }>(
      `
    SELECT
      date,
      networth
    FROM networth_trend
    ORDER BY date;
      `
    );

  }
// networhMoM is month over month - last month to current month
  async networthMoM() {
    return query<{  value: number }>(
      `
    SELECT
      curr.networth - prev.networth AS delta
    FROM networth_trend curr
      JOIN networth_trend prev
      ON prev.date = (
        SELECT MAX(date)
          FROM networth_trend
        WHERE strftime('%Y-%m', date) =
            strftime('%Y-%m', curr.date, '-1 month')
      )
      WHERE curr.date = (
        SELECT MAX(date) FROM networth_trend
      `
    );
    
  }

  async networthByDate() {
    return query<{ date: string; value: number }>(
      `
      SELECT t.txn_date AS date,
             SUM(t.amount * fn.networth_sign) AS value
      FROM transactions t
      JOIN item i ON t.item_id = i.id
      JOIN category c ON i.category_id = c.id
      JOIN financial_nature fn ON c.nature_code = fn.code
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE tt.affects_networth = 1
      GROUP BY t.txn_date
      ORDER BY t.txn_date
      `
    );
  }

  async sumByItemAndGroup(itemId: number, group: TransactionGroup) {
    const rows = await query<{ sum: number }>(
      `
      SELECT SUM(t.amount) AS sum
      FROM transactions t
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE t.item_id = ? AND tt.group_code = ?
      `,
      [itemId, group]
    );
    return rows[0]?.sum ?? 0;
  }

  async sumByCategory(categoryId: number, group: TransactionGroup) {
    const rows = await query<{ sum: number }>(
      `
      WITH RECURSIVE cats AS (
        SELECT id FROM category WHERE id = ?
        UNION ALL
        SELECT c.id FROM category c JOIN cats ON c.parent_id = cats.id
      )
      SELECT SUM(t.amount) AS sum
      FROM transactions t
      JOIN item i ON t.item_id = i.id
      JOIN cats ON i.category_id = cats.id
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE tt.group_code = ?
      `,
      [categoryId, group]
    );
    return rows[0]?.sum ?? 0;
  }
}
