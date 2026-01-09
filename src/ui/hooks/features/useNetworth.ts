import { netWorthService } from '@/container'
import { useAsyncRunner } from '../utils/useAsyncRunner'
// TODO these are not used so we may remove these later
export function useNetWorth() {
  const snapshot = useAsyncRunner(
    () => netWorthService.getLatest(),
    []
  )

  const byCategory = useAsyncRunner(
    () => netWorthService.getLatestCategoryNetworth(),
    []
  )
  const MoMChange = useAsyncRunner(
    () => netWorthService.getMoMTrend(),
    []
  )

  return {
    overall: snapshot.data,
    byCategory: byCategory.data,
    MoMChange: MoMChange.data,
    loading: snapshot.loading || byCategory.loading || MoMChange.loading,
    error: snapshot.error || byCategory.error,
  }
}
