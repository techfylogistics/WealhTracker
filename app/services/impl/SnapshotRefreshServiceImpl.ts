import {
  SnapshotRefreshService
} from '../services';
import {
  BackgroundComputationRepository,
  CacheQueryRepository,
  CategoryQueryRepository
} from '../../repositories/repositories';
import {
  XirrService
} from '../services';

export class SnapshotRefreshServiceImpl
  implements SnapshotRefreshService {

  constructor(
    private backgroundRepo: BackgroundComputationRepository,
    private cacheRepo: CacheQueryRepository,
    private categoryQueryRepo: CategoryQueryRepository,
    private xirrService: XirrService
  ) {}

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
    const leafCategories =
      await this.categoryQueryRepo.getLeafCategories();

    for (const categoryId of leafCategories) {
      await this.xirrService.computeForCategory(categoryId);
    }

    await this.xirrService.computeOverall();
  }

  async refreshAll(): Promise<void> {
    await this.refreshItemSummaries();
    await this.refreshNetWorth();
    await this.refreshCategoryNetWorth();
    await this.refreshXirr();
  }
}
