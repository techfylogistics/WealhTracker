import { CategoryRepository } from "../../domain/repositories/repositories-index";
import { CategoryService } from "../../domain/services/services-index";
import { Category } from "../../domain/models/models-index";

export class CategoryServiceImpl implements CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository
  ) { }

  async createCategory(input: Omit<Category, 'id'>): Promise<number> {
    return this.categoryRepo.create(input);
  }

  async updateCategory(category: Category): Promise<void> {
    await this.categoryRepo.update(category);
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryRepo.delete(categoryId);
  }
}
