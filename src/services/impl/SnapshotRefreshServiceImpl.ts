import {
  SnapshotRefreshService,
  XirrRefreshService
} from '../../domain/services/services-index';
import {
  BackgroundComputationRepository

} from '../../domain/repositories/repositories-index';

export class SnapshotRefreshServiceImpl
  implements SnapshotRefreshService {

  constructor(
    private backgroundRepo: BackgroundComputationRepository,
    // private cacheRepo: CacheQueryRepository,
    // private categoryQueryRepo: CategoryQueryRepository,
    private xirrRefreshService: XirrRefreshService
  ) { }

  async refreshItemSummaries(): Promise<void> {
    await this.backgroundRepo.refreshItemFinancialSummaries();
    await this.backgroundRepo.refreshItemCurrentValues();
  }

  async refreshNetWorth(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.backgroundRepo.refreshNetworthSnapshot(today);
  }

  async refreshCategoryNetWorth(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.backgroundRepo.refreshCategoryNetworthSnapshot(today);
  }

  async refreshXirr(): Promise<void> {
    // const leafCategories =
    //   await this.categoryQueryRepo.getLeafCategories();

    // for (const categoryId of leafCategories) {
    //   await this.xirrService.computeForCategory(categoryId);
    // }

    await this.xirrRefreshService.xirrRefreshAll();
  }

  async refreshAll(): Promise<void> {
    await this.refreshItemSummaries();
    await this.refreshNetWorth();
    await this.refreshCategoryNetWorth();
    await this.refreshXirr();
  }
}
