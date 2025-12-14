import {
  FinancialSummaryService,
  FinancialSummary
} from '../services';
import {
  TransactionQueryRepository
} from '../../repositories/repositories';

export class FinancialSummaryServiceImpl
  implements FinancialSummaryService {

  constructor(
    private txnQueryRepo: TransactionQueryRepository
  ) {}

  async getItemSummary(
    itemId: number
  ): Promise<FinancialSummary> {

    const breakdown =
      await this.txnQueryRepo.getItemFinancialBreakdown(itemId);

    const netGain =
      breakdown.returns - breakdown.expenses;

    return {
      invested: breakdown.invested,
      returns: breakdown.returns,
      expenses: breakdown.expenses,
      netGain
    };
  }
}
