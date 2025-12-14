import {
  ValuationPolicyRepository,
  ValuationPolicy
} from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteValuationPolicyRepository
  implements ValuationPolicyRepository {

  async getByCategory(
    categoryId: number
  ): Promise<ValuationPolicy | null> {
    const rows = await query<ValuationPolicy>(
      `
      SELECT
        category_id AS categoryId,
        valuation_frequency AS valuationFrequency,
        allow_manual_override AS allowManualOverride
      FROM valuation_policy
      WHERE category_id = ?
      `,
      [categoryId]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<ValuationPolicy[]> {
    return query<ValuationPolicy>(
      `
      SELECT
        category_id AS categoryId,
        valuation_frequency AS valuationFrequency,
        allow_manual_override AS allowManualOverride
      FROM valuation_policy
      `
    );
  }
}
