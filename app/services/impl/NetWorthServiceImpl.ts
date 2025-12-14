import {
  NetWorthService,
  NetWorthSnapshot,
  NetWorthTrendPoint,
  CategoryNetWorth,
  NetWorth
} from '../services';
import {
  TransactionQueryRepository,
  CacheQueryRepository,
  CategoryQueryRepository
} from '../../repositories/repositories';

export class NetWorthServiceImpl
  implements NetWorthService {

  constructor(
    private txnQueryRepo: TransactionQueryRepository,
    private cacheRepo: CacheQueryRepository,
    private categoryQueryRepo: CategoryQueryRepository
  ) {}

  async getLatest(): Promise<NetWorthSnapshot> {
    const cached = await this.cacheRepo.getLatestNetworth();
    if (cached) {
      return cached;
    }

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

  async getCategoryNetWorth(
    snapshotDate: string
  ): Promise<CategoryNetWorth[]> {
    return this.categoryQueryRepo.getCategoryNetworthSnapshot(
      snapshotDate
    );
  }

  async getOverallNetWorth(snapshotDate: string) {
    const rows =
      await this.categoryQueryRepo.getCategoryNetworthSnapshot(
        snapshotDate
      );

    const total = rows.reduce(
      (sum, r) => sum + r.value,
      0
    );

    return { value: total };
  }


}
