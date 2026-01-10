import { DocumentRepository } from "@/src/domain/repositories/repositories-index";
import { DocumentService } from "@/src/domain/services/services-index";
import { ItemDocument } from '@/src/domain/models/models-index';
export class DocumentServiceImpl implements DocumentService {
  constructor(
    private readonly documentRepo: DocumentRepository
  ) { }

  async addDocument(
    input: Omit<ItemDocument, 'id' | 'uploadedAt'>
  ): Promise<number> {
    return this.documentRepo.add(input);
  }

  async listDocuments(itemId: number): Promise<ItemDocument[]> {
    return this.documentRepo.listByItem(itemId);
  }

  async deleteDocument(documentId: number): Promise<void> {
    await this.documentRepo.delete(documentId);
  }
}
