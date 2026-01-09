# UI → Service Mapping

## Dashboard / Portfolio
- Screen: DashboardScreen
- Hook: useNetWorth
- Service: netWorthService
- Responsibility: aggregated net worth snapshot + trends

## Category Tree
- Screen: CategoryScreen
- Hook: useCategoryHierarchy
- Service: categoryHierarchyService
- Responsibility: category structure & behavior

## Transactions
- Screen: TransactionScreen
- Hook: useTransactionSemantic
- Service: transactionSemanticService
- Responsibility: transaction classification & semantics

## Background Refresh
- Hook: useSnapshotRefresh
- Service: snapshotRefreshService
- Responsibility: recompute snapshots and cached data

## XIRR
- Hook: useXirr
- Service: xirrRefreshService
- Responsibility: XIRR calculations
