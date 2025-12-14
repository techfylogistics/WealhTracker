import {
  TransactionTypeRepository,
  TransactionType
} from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteTransactionTypeRepository
  implements TransactionTypeRepository {

  async getByCode(code: string): Promise<TransactionType | null> {
    const rows = await query<TransactionType>(
      `
      SELECT
        code,
        label,
        is_cashflow AS isCashflow,
        is_return AS isReturn,
        is_expense AS isExpense,
        affects_xirr AS affectsXirr,
        affects_networth AS affectsNetworth,
        group_code AS groupCode
      FROM transaction_type
      WHERE code = ?
      `,
      [code]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<TransactionType[]> {
    return query<TransactionType>(
      `
      SELECT
        code,
        label,
        is_cashflow AS isCashflow,
        is_return AS isReturn,
        is_expense AS isExpense,
        affects_xirr AS affectsXirr,
        affects_networth AS affectsNetworth,
        group_code AS groupCode
      FROM transaction_type
      ORDER BY code
      `
    );
  }

  async listReturns(): Promise<TransactionType[]> {
    return query<TransactionType>(
      `
      SELECT
        code,
        label,
        is_cashflow AS isCashflow,
        is_return AS isReturn,
        is_expense AS isExpense,
        affects_xirr AS affectsXirr,
        affects_networth AS affectsNetworth,
        group_code AS groupCode
      FROM transaction_type
      WHERE is_return = 1
      ORDER BY code
      `
    );
  }

  async listExpenses(): Promise<TransactionType[]> {
    return query<TransactionType>(
      `
      SELECT
        code,
        label,
        is_cashflow AS isCashflow,
        is_return AS isReturn,
        is_expense AS isExpense,
        affects_xirr AS affectsXirr,
        affects_networth AS affectsNetworth,
        group_code AS groupCode
      FROM transaction_type
      WHERE is_expense = 1
      ORDER BY code
      `
    );
  }
}
