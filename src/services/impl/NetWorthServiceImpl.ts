import {
  NetWorthSnapshot,
  NetWorthTrendPoint,
  CategoryNetWorth,
  NetWorth
} from '@/query-models/query-models-index';
import {
  TransactionQueryRepository,
  CacheQueryRepository,
  CategoryQueryRepository
} from '../../domain/repositories/repositories-index';
import { NetWorthService } from '@/domain/services/services-index';

export class NetWorthServiceImpl
  implements NetWorthService {

  constructor(
    private txnQueryRepo: TransactionQueryRepository,
    private cacheRepo: CacheQueryRepository,
    private categoryQueryRepo: CategoryQueryRepository
  ) { }

  async getLatest(): Promise<NetWorthSnapshot> {
    const cached = await this.cacheRepo.getLatestNetworth();
    if (cached) {
      return cached;
    }
    console.log("no networth in cashed so calculating now");
    const totals = await this.txnQueryRepo.sumForNetworth();

    return {
      totalAssets: totals.assets,
      totalLiabilities: totals.liabilities,
      networth: totals.assets + totals.liabilities
    };
  }

  async getTrend(): Promise<NetWorthTrendPoint[]> {
    const rows = await this.txnQueryRepo.networthTrend();

    return rows.map(r => ({
      date: r.date,
      networth: r.value
    }));
  }

  async getMoMTrend(): Promise<NetWorth[]> {
    const rows = await this.txnQueryRepo.networthMoM();

    return rows.map(r => ({
      value: r.value
    }));
  }

  async getCategoryNetWorthSnapshot(
    snapshotDate: string
  ): Promise<CategoryNetWorth[]> {
    return this.categoryQueryRepo.getCategoryNetworthSnapshot(
      snapshotDate
    );
  }
  async getLatestCategoryNetworth() {
    return this.cacheRepo.getLatestCategoryNetworth();
  }
  async getlatestItemCurrentValue(itemId: number) {
    return this.cacheRepo.getItemCurrentValue(itemId);
  }
  async getOverallNetWorthSnapshot(snapshotDate: string) {
    const rows =
      await this.cacheRepo.getNetworthSnapshot(
        snapshotDate
      );

    const total = rows.reduce(
      (sum, r) => sum + r.value,
      0
    );

    return { value: total };
  }


}
