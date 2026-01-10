import { xirrQueryService } from '@/src/container'
import { useAsyncRunner } from '../utils/useAsyncRunner'
import { ScopeType } from '@/src/types/ScopeType'
// TODO these are not used so we may remove these later

export function useXirr(scope: ScopeType, scopeId: number | null) {
  const overallAtScope = useAsyncRunner(
    () => xirrQueryService.getXirr(scope, scopeId),
    [scope, scopeId]

  )


  return {
    overall: overallAtScope.data,
    loading: overallAtScope.loading,
    error: overallAtScope.error,
  }
}

export function useXirrAll(scope: ScopeType) {


  const byScope = useAsyncRunner(
    () => xirrQueryService.getAllXirr(scope),
    [scope]

  )

  return {
    byScope: byScope.data,
    loading: byScope.loading,
    error: byScope.error,
  }
}

