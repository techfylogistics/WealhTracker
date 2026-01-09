import { XirrRefreshService, CategoryHierarchyService } from '../../domain/services/services-index';
import { TransactionRepository, ItemRepository } from '../../domain/repositories/repositories-index';
import { calculateXirr } from '../helpers/xirr';

export class XirrRefreshServiceImpl implements XirrRefreshService {
  [x: string]: any;
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly itemRepo: ItemRepository,
    private readonly categoryHierarchyService: CategoryHierarchyService,
    // private readonly xirrCacheRepo: XirrCacheRepository,


  ) { }
  async xirrRefreshOverall() {
    const xirr = await this.computeOverall();

    if (xirr !== null) {
      await this.xirrCacheRepo.upsert(
        'OVERALL',
        null,
        xirr
      );
    }
  }
  async xirrRefreshForAllCategories() {
    const categoryIds =
      await this.categoryQueryRepo.listAllCategoryIds();

    for (const categoryId of categoryIds) {
      const xirr = await this.computeForCategory(categoryId);


      if (xirr !== null) {
        await this.xirrCacheRepo.upsert(
          'CATEGORY',
          categoryId,
          xirr

        );
      }
    }

  }
  async xirrRefreshForAllItems() {

    const items = await this.itemRepo.listAll();

    for (const item of items) {
      const xirr =
        await this.computeForItem(item.id);

      if (xirr !== null) {
        await this.xirrCacheRepo.upsert(
          'ITEM',
          item.id,
          xirr

        );
      }
    }

  }
  async xirrRefreshAll() {
    this.xirrRefreshOverall();
    this.xirrRefreshForAllCategories();
    this.xirrRefreshForAllItems();
  }
  async computeForItem(itemId: number): Promise<number | null> {
    const cashflows =
      await this.transactionRepo.listForXirr(itemId);

    if (!cashflows || cashflows.length < 2) return null;

    const xirrDecimal = calculateXirr(cashflows);
    if (xirrDecimal === null) return null;

    return xirrDecimal * 100;
  }

  async computeForCategory(categoryId: number): Promise<number | null> {
    const categoryIds =
      await this.categoryHierarchyService.getDescendants(
        // await this.categoryHierarchyService.getDescendantCategoryIds(

        categoryId
      );
    categoryIds.push(categoryId); //descendants donot include self so adding

    let items: string | any[] = [];

    for (const catId of categoryIds) {

      items =
        await this.itemRepo.listByCategory(catId);
    }

    if (items.length === 0) return null;

    const allCashflows: { date: string; amount: number }[] = [];

    for (const item of items) {
      const cashflows =
        await this.transactionRepo.listForXirr(item.id);

      allCashflows.push(...cashflows);
    }

    if (allCashflows.length < 2) return null;

    const xirrDecimal = calculateXirr(allCashflows);
    if (xirrDecimal === null) return null;

    return xirrDecimal * 100;
  }

  // ===============================
  // ✅ PORTFOLIO XIRR (ALL ITEMS)
  // ===============================
  async computeOverall(): Promise<number | null> {
    const items = await this.itemRepo.listAllActive();//   .listAll();

    if (items.length === 0) return null;

    const allCashflows: { date: string; amount: number }[] = [];

    for (const item of items) {
      const cashflows =
        await this.transactionRepo.listForXirr(item.id);

      allCashflows.push(...cashflows);
    }

    if (allCashflows.length < 2) return null;

    const xirrDecimal = calculateXirr(allCashflows);
    if (xirrDecimal === null) return null;

    return xirrDecimal * 100;
  }
  // async latestTxns() {
  //   this.transactionRepo.txnListLatest5();
  // }
}
