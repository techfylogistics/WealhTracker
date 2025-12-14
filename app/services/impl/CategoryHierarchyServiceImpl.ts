import {
  CategoryHierarchyService
} from '../services';
import {
  CategoryRepository,
  CategoryQueryRepository,
  CategoryCapabilityRepository,
  UIBehaviorRepository
} from '../../repositories/repositories';

export class CategoryHierarchyServiceImpl
  implements CategoryHierarchyService {

  constructor(
    private categoryRepo: CategoryRepository,
    private categoryQueryRepo: CategoryQueryRepository,

    private capabilityRepo: CategoryCapabilityRepository,
    private uiBehaviorRepo: UIBehaviorRepository
  ) {}

  async getAncestors(categoryId: number): Promise<number[]> {
    const ancestors = await this.categoryRepo.getAncestors(categoryId);
    return ancestors.map(c => c.id);
  }

  async getDescendants(categoryId: number): Promise<number[]> {
    const descendants = await this.categoryRepo.getDescendants(categoryId);
    return descendants.map(c => c.id);
  }

  async isLeafCategory(categoryId: number): Promise<boolean> {
    return this.categoryRepo.isLeaf(categoryId);
  }

  async getEffectiveCategoryCapability(
    categoryId: number
  ): Promise<{
    supportsLocation: boolean;
    supportsDocuments: boolean;
    supportsReturns: boolean;
    supportsValuation: boolean;
    supportsImport: boolean;
  }> {
    const lineage = [
      categoryId,
      ...(await this.getAncestors(categoryId))
    ];

    for (const id of lineage) {
      const capability =
        await this.capabilityRepo.getByCategory(id);
      if (capability) {
        return {
          supportsLocation: capability.supportsLocation,
          supportsDocuments: capability.supportsDocuments,
          supportsReturns: capability.supportsReturns,
          supportsValuation: capability.supportsValuation,
          supportsImport: capability.supportsImport
        };
      }
    }

    return {
      supportsLocation: false,
      supportsDocuments: false,
      supportsReturns: false,
      supportsValuation: false,
      supportsImport: false
    };
  }

  async getEffectiveUIBehavior(
    categoryId: number
  ): Promise<{
    showMapPicker: boolean;
    showSmsBalance: boolean;
    showImport: boolean;
  }> {
    const lineage = [
      categoryId,
      ...(await this.getAncestors(categoryId))
    ];

    for (const id of lineage) {
      const uiBehavior =
        await this.uiBehaviorRepo.getByCategory(id);
      if (uiBehavior) {
        return {
          showMapPicker: uiBehavior.showMapPicker,
          showSmsBalance: uiBehavior.showSmsBalance,
          showImport: uiBehavior.showImport
        };
      }
    }

    return {
      showMapPicker: false,
      showSmsBalance: false,
      showImport: false
    };
  }
  async getCategoryTree() {
    return this.categoryQueryRepo.getCategoryTree();
  }

  async getLeafCategoryIds() {
    return this.categoryQueryRepo.getLeafCategories();
  }
}
