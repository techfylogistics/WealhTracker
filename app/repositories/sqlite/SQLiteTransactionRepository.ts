import { TransactionRepository, Transaction } from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteTransactionRepository implements TransactionRepository {

  async add(txn: Omit<Transaction, 'id'>): Promise<number> {
    await execute(
      `
      INSERT INTO transactions (
        item_id,
        txn_date,
        amount,
        txn_type_code,
        notes
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        txn.itemId,
        txn.txnDate,
        txn.amount,
        txn.txnTypeCode,
        txn.notes ?? null
      ]
    );

    const rows = await query<{ id: number }>(
      `SELECT last_insert_rowid() AS id`
    );
    return rows[0].id;
  }

  async update(txn: Transaction): Promise<void> {
    await execute(
      `
      UPDATE transactions
      SET
        item_id = ?,
        txn_date = ?,
        amount = ?,
        txn_type_code = ?,
        notes = ?
      WHERE id = ?
      `,
      [
        txn.itemId,
        txn.txnDate,
        txn.amount,
        txn.txnTypeCode,
        txn.notes ?? null,
        txn.id
      ]
    );
  }

  async delete(txnId: number): Promise<void> {
    await execute(
      `DELETE FROM transactions WHERE id = ?`,
      [txnId]
    );
  }

  async listByItem(itemId: number): Promise<Transaction[]> {
    return query<Transaction>(
      `
      SELECT
        id,
        item_id AS itemId,
        txn_date AS txnDate,
        amount,
        txn_type_code AS txnTypeCode,
        notes
      FROM transactions
      WHERE item_id = ?
      ORDER BY txn_date
      `,
      [itemId]
    );
  }

  async listForXirr(
    itemId: number
  ): Promise<{ date: string; amount: number }[]> {
    return query<{ date: string; amount: number }>(
      `
      SELECT
        t.txn_date AS date,
        t.amount AS amount
      FROM transactions t
      JOIN transaction_type tt
        ON t.txn_type_code = tt.code
      WHERE t.item_id = ?
        AND tt.affects_xirr = 1
      ORDER BY t.txn_date
      `,
      [itemId]
    );
  }

  async listByItemAndType(
    itemId: number,
    txnTypeCodes: string[]
  ): Promise<Transaction[]> {
    const placeholders = txnTypeCodes.map(() => '?').join(', ');
    return query<Transaction>(
      `
      SELECT
        id,
        item_id AS itemId,
        txn_date AS txnDate,
        amount,
        txn_type_code AS txnTypeCode,
        notes
      FROM transactions
      WHERE item_id = ?
        AND txn_type_code IN (${placeholders})
      ORDER BY txn_date
      `,
      [itemId, ...txnTypeCodes]
    );
  }
}
