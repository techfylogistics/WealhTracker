import { transactionService } from '@/src/container'
import { useAsyncRunner } from '../utils/useAsyncRunner'
// TODO these are not used so we may remove these later

export function useRecentTransactions(limit = 5) {
  return useAsyncRunner(
    () => transactionService.txnListLatest5(),
    [limit]
  )
}
