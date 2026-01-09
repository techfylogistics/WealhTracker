import {
  TransactionSemanticService
} from '../../domain/services/services-index';
import {
  TransactionTypeRepository
} from '../../domain/repositories/repositories-index';

export class TransactionSemanticServiceImpl
  implements TransactionSemanticService {

  constructor(
    private txnTypeRepo: TransactionTypeRepository
  ) { }

  async validateTransactionType(
    txnTypeCode: string
  ): Promise<void> {
    const txnType =
      await this.txnTypeRepo.getByCode(txnTypeCode);

    if (!txnType) {
      throw new Error(`Invalid transaction type: ${txnTypeCode}`);
    }
  }

  async isReturnTransaction(
    txnTypeCode: string
  ): Promise<boolean> {
    const txnType =
      await this.txnTypeRepo.getByCode(txnTypeCode);

    if (!txnType) {
      throw new Error(`Invalid transaction type: ${txnTypeCode}`);
    }

    return txnType.isReturn;
  }

  async isExpenseTransaction(
    txnTypeCode: string
  ): Promise<boolean> {
    const txnType =
      await this.txnTypeRepo.getByCode(txnTypeCode);

    if (!txnType) {
      throw new Error(`Invalid transaction type: ${txnTypeCode}`);
    }

    return txnType.isExpense;
  }

  async affectsXirr(
    txnTypeCode: string
  ): Promise<boolean> {
    const txnType =
      await this.txnTypeRepo.getByCode(txnTypeCode);

    if (!txnType) {
      throw new Error(`Invalid transaction type: ${txnTypeCode}`);
    }

    return txnType.affectsXirr;
  }

  async affectsNetworth(
    txnTypeCode: string
  ): Promise<boolean> {
    const txnType =
      await this.txnTypeRepo.getByCode(txnTypeCode);

    if (!txnType) {
      throw new Error(`Invalid transaction type: ${txnTypeCode}`);
    }

    return txnType.affectsNetworth;
  }
}
