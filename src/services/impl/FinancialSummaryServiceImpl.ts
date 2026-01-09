// import {
//     FinancialSummary
// } from '../../view-models/viewmodels';
import { FinancialSummary } from '@//query-models/NetworthView';
import {
  TransactionQueryRepository
} from '../../domain/repositories/repositories-index';
import { FinancialSummaryService } from '@/domain/services/services-index';

export class FinancialSummaryServiceImpl
  implements FinancialSummaryService {

  constructor(
    private txnQueryRepo: TransactionQueryRepository
  ) { }

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
