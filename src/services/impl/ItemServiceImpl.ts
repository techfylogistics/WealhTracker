import { ItemRepository } from "@/src/domain/repositories/repositories-index";
import { ItemService } from "@/src/domain/services/services-index";
import { Item } from "@/src/domain/models/models-index";

export class ItemServiceImpl implements ItemService {
  constructor(
    private readonly itemRepo: ItemRepository
  ) { }

  async createItem(input: Omit<Item, 'id'>): Promise<number> {
    return this.itemRepo.create(input);
  }

  async updateItem(item: Item): Promise<void> {
    await this.itemRepo.update(item);
  }

  async deleteItem(itemId: number): Promise<void> {
    await this.itemRepo.delete(itemId);
  }

  async getItem(itemId: number): Promise<Item | null> {
    return this.itemRepo.getById(itemId);
  }

  async listItemsByCategory(categoryId: number): Promise<Item[]> {
    return this.itemRepo.listByCategory(categoryId);
  }
}
