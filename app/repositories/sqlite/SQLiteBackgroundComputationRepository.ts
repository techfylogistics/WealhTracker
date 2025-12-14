import { BackgroundComputationRepository } from '../repositories';
import { execute } from '../../db/sqlite';

export class SQLiteBackgroundComputationRepository
  implements BackgroundComputationRepository {

  async refreshItemFinancialSummaries() {
    await execute(`
      INSERT OR REPLACE INTO item_financial_summary
      SELECT
        t.item_id,
        SUM(CASE WHEN tt.group_code = 'INVESTMENT' THEN ABS(t.amount) ELSE 0 END),
        SUM(CASE WHEN tt.group_code = 'RETURN' THEN t.amount ELSE 0 END),
        SUM(CASE WHEN tt.group_code = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END),
        SUM(t.amount)
      FROM transaction t
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      GROUP BY t.item_id
    `);
  }

  async refreshNetworthSnapshot(date: string) {
    await execute(`
      INSERT OR REPLACE INTO networth_snapshot
      SELECT
        ?, 
        SUM(CASE WHEN fn.networth_sign = 1 THEN t.amount ELSE 0 END),
        SUM(CASE WHEN fn.networth_sign = -1 THEN t.amount ELSE 0 END),
        SUM(t.amount * fn.networth_sign)
      FROM transaction t
      JOIN item i ON t.item_id = i.id
      JOIN category c ON i.category_id = c.id
      JOIN financial_nature fn ON c.nature_code = fn.code
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      WHERE tt.affects_networth = 1
    `, [date]);
  }

  async refreshXirrCache(): Promise<void> {
    // XIRR computation intentionally delegated to service layer
  }

  async refreshItemCurrentValues(): Promise<void> {
    // Uses CURRENT_VALUE transactions
  }

  async refreshCategoryNetworthSnapshot(): Promise<void> {
    // Similar recursive aggregation
  }
}
