import type {
  NetWorthService,
  XirrQueryService,
  ItemService,
  TransactionService

} from "@/src/domain/services/services-index";

import type {
  AssetCategoryDetailViewModel,
  AssetDonutVM,
  AssetCardVM,
  CategoryTransactionVM,
  CategoryTrendPointVM,
} from "@/src/us/view-models/category";
import { categoryHierarchyService } from "@/src/container";

type CacheEntry<V> = {
  expiresAt: number;
  value: Promise<V>;
};

export class AssetCategoryDetailUiServiceImpl {
  private static readonly CACHE_TTL_MS = 5 * 60 * 1000;
  private readonly categoryNameCache = new Map<number, CacheEntry<string | null>>();
  private readonly categoryXirrCache = new Map<number, CacheEntry<number>>();
  private readonly itemXirrCache = new Map<number, CacheEntry<number>>();
  private readonly itemValueCache = new Map<number, CacheEntry<{ value: number } | null>>();
  private readonly categorySnapshotCache = new Map<string, CacheEntry<{ categoryId: number; value: number }[]>>();

  constructor(
    private readonly netWorthService: NetWorthService,
    private readonly xirrQueryService: XirrQueryService,
    private readonly itemService: ItemService,
    private readonly transactionService: TransactionService
  ) { }

  private getOrSetCache<K, V>(
    cache: Map<K, CacheEntry<V>>,
    key: K,
    factory: () => Promise<V>,
    ttlMs: number
  ): Promise<V> {
    const now = Date.now();
    const existing = cache.get(key);
    if (existing && existing.expiresAt > now) {
      return existing.value;
    }

    const created = factory().catch(err => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, { value: created, expiresAt: now + ttlMs });
    return created;
  }

  private getRangeStartDate(range: '1M' | '3M' | '6M' | '1Y' | '5Y'): Date {
    const start = new Date();
    switch (range) {
      case '1M':
        start.setMonth(start.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(start.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(start.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case '5Y':
        start.setFullYear(start.getFullYear() - 5);
        break;
    }
    return start;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  async getAssetCategoryDetailVM(
    categoryId: number,
    range: '1M' | '3M' | '6M' | '1Y' | '5Y'
  ): Promise<AssetCategoryDetailViewModel> {

    const [
      items,
      categoryXirr,
      transactions,
      trend,
    ] = await Promise.all([
      this.itemService.listItemsByCategory(categoryId),
      this.getOrSetCache(
        this.categoryXirrCache,
        categoryId,
        () => this.xirrQueryService.getXirr("CATEGORY", categoryId),
        AssetCategoryDetailUiServiceImpl.CACHE_TTL_MS
      ),
      this.transactionService.txnListLatest5(),
      this.netWorthService.getTrend(),
    ]);

    const rangeStart = this.getRangeStartDate(range).getTime();
    const trendInRange = trend.filter(p => new Date(p.date).getTime() >= rangeStart);
    const trendPointsSource = trendInRange.length > 0 ? trendInRange : trend;
    const snapshotDate =
      trendPointsSource[trendPointsSource.length - 1]?.date ??
      this.formatDate(new Date());
    const categorySnapshot = await this.getOrSetCache(
      this.categorySnapshotCache,
      snapshotDate,
      () => this.netWorthService.getCategoryNetWorthSnapshot(snapshotDate),
      AssetCategoryDetailUiServiceImpl.CACHE_TTL_MS
    );

    const categoryValue =
      categorySnapshot.find(c => c.categoryId === categoryId)?.value ?? 0;

    const donut: AssetDonutVM[] = [];
    const assets: AssetCardVM[] = [];

    const itemDetails = await Promise.all(items.map(async item => {
      const [xirr, itemCurrentValue] = await Promise.all([
        this.getOrSetCache(
          this.itemXirrCache,
          item.id,
          () => this.xirrQueryService.getXirr("ITEM", item.id),
          AssetCategoryDetailUiServiceImpl.CACHE_TTL_MS
        ),
        this.getOrSetCache(
          this.itemValueCache,
          item.id,
          () => this.netWorthService.getlatestItemCurrentValue(item.id),
          AssetCategoryDetailUiServiceImpl.CACHE_TTL_MS
        ),
      ]);
      return { item, xirr, itemCurrentValue };
    }));

    for (const { item, xirr, itemCurrentValue } of itemDetails) {
      donut.push({
        assetId: item.id,
        assetName: item.name,
        value: itemCurrentValue?.value ?? 0,
        color: `asset-${item.id}`,
      });

      assets.push({
        assetId: item.id,
        assetName: item.name,
        value: itemCurrentValue?.value ?? 0,
        xirr,
        color: `asset-${item.id}`,
      });
    }

    const recentTransactions: CategoryTransactionVM[] = transactions
      .filter(t => items.some(i => i.id === t.itemId))
      .map(t => ({
        transactionId: t.id,
        assetName:
          items.find(i => i.id === t.itemId)?.name ?? '',
        title: t.notes ?? t.txnTypeCode,
        amount: t.amount,
        date: t.txnDate,
      }));

    const trendPoints: CategoryTrendPointVM[] = trendPointsSource.map(p => ({
      date: p.date,
      value: p.networth,
    }));
    const categoryName = await this.getOrSetCache(
      this.categoryNameCache,
      categoryId,
      () => categoryHierarchyService.getById(categoryId),
      AssetCategoryDetailUiServiceImpl.CACHE_TTL_MS
    );
    return {
      categoryId,
      categoryName: categoryName ?? 'Category',
      totalValue: categoryValue,
      categoryXirr,
      moMChangePct: null,
      donut,
      trend: trendPoints,
      recentTransactions,
      assets,
    };
  }
}
