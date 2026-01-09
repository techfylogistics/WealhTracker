import { BackgroundComputationRepository } from '../../domain/repositories/repositories-index';
import { execute, query } from '../../db/sqlite';


export class SQLiteBackgroundComputationRepository
  implements BackgroundComputationRepository {



  async refreshItemFinancialSummaries() {




    console.log("In refreshItemFinancialSummaries");

    await execute(`
      INSERT OR REPLACE INTO item_financial_summary
      SELECT
        t.item_id,
        SUM(CASE WHEN tt.group_code = 'INVESTMENT' THEN ABS(t.amount) ELSE 0 END),
        SUM(CASE WHEN tt.group_code = 'RETURN' THEN t.amount ELSE 0 END),
        SUM(CASE WHEN tt.group_code = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END),
        SUM(t.amount)
      FROM transactions t
      JOIN transaction_type tt ON t.txn_type_code = tt.code
      GROUP BY t.item_id
    `);
  }

  async refreshNetworthSnapshot(date: string) {
    console.log("In refreshNetworthSnapshot");

    await execute(
      `
    INSERT OR REPLACE INTO networth_snapshot (
      snapshot_date,
      total_assets,
      total_liabilities,
      networth
    )
    SELECT
      ? AS snapshot_date,
      COALESCE(
        SUM(CASE WHEN fn.networth_sign = 1 THEN t.amount ELSE 0 END),
        0
      ) AS total_assets,
      COALESCE(
        SUM(CASE WHEN fn.networth_sign = -1 THEN ABS(t.amount) ELSE 0 END),
        0
      ) AS total_liabilities,
      COALESCE(
        SUM(t.amount * fn.networth_sign),
        0
      ) AS networth
    FROM transactions t
    JOIN item i ON t.item_id = i.id
    JOIN category c ON i.category_id = c.id
    JOIN financial_nature fn ON c.nature_code = fn.code
    JOIN transaction_type tt ON t.txn_type_code = tt.code
    WHERE tt.affects_networth = 1
    `,
      [date]
    );
    const rows = await query<any>(
      `SELECT * FROM networth_snapshot ORDER BY snapshot_date DESC LIMIT 1`
    );
    console.log("in refreshNetworthSnapshot in repo, rows returned ", rows[0]);
    const trnrows = await query<any>(
      `SELECT * FROM transactions LIMIT 10`
    );
    console.log("in transactions table entries ", trnrows.length, trnrows[0]);

  }








  async refreshItemCurrentValues(): Promise<void> {
    console.log("In refreshItemCurrentValues");

    // Clear existing
    await execute(`DELETE FROM item_current_value`);
    //compute current value
    await execute(`
    INSERT INTO item_current_value (item_id, value, last_updated)
    SELECT
      item_id,
      COALESCE(SUM(amount), 0),
      DATE('now')
    FROM transactions
    GROUP BY item_id
  `);
    // Uses CURRENT_VALUE transactions
  }
  async refreshCategoryNetworthSnapshot(date: string) {

    // async refreshCategoryNetworthSnapshot(): Promise<void> {
    // Similar recursive aggregation
    console.log("In refreshCategoryNetworthSnapshot");

    await execute(`
     INSERT OR REPLACE INTO category_networth_snapshot (
     snapshot_date,
      category_id,
      value    )
    SELECT
    ?  AS snapshot_date,
      c.id AS category_id,
      COALESCE(SUM(icv.value), 0) AS value
    FROM category c
    LEFT JOIN item i
      ON i.category_id = c.id
    LEFT JOIN item_current_value icv
      ON icv.item_id = i.id
    GROUP BY c.id;
  `, [date]);
  }

  // // To Calculate & Refresh XIRR cache 
  // async refreshXirrCache() {
  //   this.refreshXirrForaLLCategorIES();
  //   this.refreshXirrOverall();
  // }
  // async updateXirrCache(
  //   scopeType: XirrScopeType,
  //   scopeId: number | null,
  //   xirr: number
  //   // lastComputed: string
  // ): Promise<void> {
  //   await execute(
  //     `
  //   INSERT INTO xirr_cache (
  //     scope_type,
  //     scope_id,
  //     xirr,
  //     DATE('now')
  //   )
  //   VALUES (?, ?, ?, ?)
  //   ON CONFLICT(scope_type, scope_id)
  //   DO UPDATE SET
  //     xirr = excluded.xirr,
  //     last_computed = excluded.DATE('now')
  //   `,
  //     [scopeType, scopeId, xirr]
  //   );
  // }


  // async refreshXirrForItem(itemId: number) {
  //   const cashflows =
  //     await this.transactionRepo.listForXirr(itemId);

  //   if (!cashflows || cashflows.length < 2) return null;

  //   const xirrDecimal = calculateXirr(cashflows);
  //   if (xirrDecimal !== null)
  //     this.updateXirrCache('ITEM', itemId, xirrDecimal * 100);
  //   // return xirrDecimal * 100;

  // }

  // async refreshXirrForCategory(categoryId: number) {

  //   const descendants =
  //     await this.categoryRepo.getDescendants(
  //       // await this.categoryHierarchyService.getDescendantCategoryIds(

  //       categoryId
  //     );
  //   const categoryIds = descendants.map(c => c.id);
  //   categoryIds.push(categoryId); //descendants donot include self so adding

  //   let items: string | any[] = [];

  //   for (const catId of categoryIds) {

  //     items =
  //       await this.itemRepo.listByCategory(catId);
  //   }

  //   if (items.length === 0) return null;

  //   const allCashflows: { date: string; amount: number }[] = [];

  //   for (const item of items) {
  //     const cashflows =
  //       await this.transactionRepo.listForXirr(item.id);

  //     allCashflows.push(...cashflows);
  //   }

  //   if (allCashflows.length < 2) return null;

  //   const xirrDecimal = calculateXirr(allCashflows);
  //   // if (xirrDecimal === null) return null;
  //   if (xirrDecimal !== null)
  //     this.updateXirrCache('CATEGORY', categoryId, xirrDecimal * 100);
  //   // return xirrDecimal * 100;
  // }
  // async refreshXirrForaLLCategorIES() {

  //   const descendants =
  //     await this.categoryRepo.getChildren(
  //       // await this.categoryHierarchyService.getDescendantCategoryIds(

  //       null
  //     );
  //   const categoryIds = descendants.map(c => c.id);
  //   for (const categoryId of categoryIds) {
  //     this.refreshXirrForCategory(categoryId);
  //   }
  // }
  // // ===============================
  // // ✅ PORTFOLIO XIRR (ALL ITEMS)
  // // ===============================
  // async refreshXirrOverall(){
  //   const items = await this.itemRepo.listAllActive();//   .listAll();

  //   if (items.length === 0) return null;

  //   const allCashflows: { date: string; amount: number }[] = [];

  //   for (const item of items) {
  //     const cashflows =
  //       await this.transactionRepo.listForXirr(item.id);

  //     allCashflows.push(...cashflows);
  //   }

  //   if (allCashflows.length < 2) return null;

  //   const xirrDecimal = calculateXirr(allCashflows);
  //   // if (xirrDecimal === null) return null;
  //   if (xirrDecimal !== null)
  //     this.updateXirrCache('OVERALL', null, xirrDecimal * 100);
  // }
}
