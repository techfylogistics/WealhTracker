import { TransactionRepository } from "@/domain/repositories/repositories-index";
import { TransactionSemanticService, TransactionService } from "@/domain/services/services-index";
import { Transaction } from "@/domain/models/models-index";

export class TransactionServiceImpl implements TransactionService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly semanticService: TransactionSemanticService
  ) { }

  async addTransaction(
    input: Omit<Transaction, 'id'>
  ): Promise<number> {
    await this.semanticService.validateTransactionType(input.txnTypeCode);
    return this.transactionRepo.add(input);
  }

  async updateTransaction(txn: Transaction): Promise<void> {
    await this.semanticService.validateTransactionType(txn.txnTypeCode);
    await this.transactionRepo.update(txn);
  }

  async deleteTransaction(txnId: number): Promise<void> {
    await this.transactionRepo.delete(txnId);
  }

  async listTransactionsForItem(itemId: number): Promise<Transaction[]> {
    return this.transactionRepo.listByItem(itemId);
  }

  async txnListLatest5(): Promise<Transaction[]> {
    return this.transactionRepo.txnListLatest5();
  }
}
