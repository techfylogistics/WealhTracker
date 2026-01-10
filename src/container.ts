/* =========================================================
   Composition Root (container.ts)
   - Instantiates repositories and services exactly once
   - Applies cross-cutting concerns (logging, tracing)
   - NO business logic
========================================================= */

import { withLogging } from '../src/utils/loggerProxy'

/* =========================================================
   SQLITE REPOSITORIES (NO LOGGING HERE)
   ========================================================= */

import { SQLiteCategoryRepository } from './repositories-impl/sqlite/SQLiteCategoryRepository'
import { SQLiteCategoryQueryRepository } from './repositories-impl/sqlite/SQLiteCategoryQueryRepository'
import { SQLiteItemRepository } from './repositories-impl/sqlite/SQLiteItemRepository'
import { SQLiteTransactionRepository } from './repositories-impl/sqlite/SQLiteTransactionRepository'
import { SQLiteTransactionQueryRepository } from './repositories-impl/sqlite/SQLiteTransactionQueryRepository'
import { SQLiteTransactionTypeRepository } from './repositories-impl/sqlite/SQLiteTransactionTypeRepository'
// import { SQLiteMetadataRepository } from './repositories-impl/sqlite/SQLiteMetadataRepository'
// import { SQLiteDocumentRepository } from './repositories-impl/sqlite/SQLiteDocumentRepository'
// import { SQLiteContactRepository } from './repositories-impl/sqlite/SQLiteContactRepository'
import { SQLiteCacheQueryRepository } from './repositories-impl/sqlite/SQLiteCacheQueryRepository'
import { SQLiteBackgroundComputationRepository } from './repositories-impl/sqlite/SQLiteBackgroundComputationRepository'
// import { SQLiteValuationPolicyRepository } from './repositories-impl/sqlite/SQLiteValuationPolicyRepository'
import { SQLiteUIBehaviorRepository } from './repositories-impl/sqlite/SQLiteUIBehaviorRepository'
import { SQLiteCategoryCapabilityRepository } from './repositories-impl/sqlite/SQLiteCategoryCapabilityRepository'

/* =========================================================
   DOMAIN SERVICE IMPLEMENTATIONS (RAW)
   ========================================================= */

import { CategoryHierarchyServiceImpl } from './services/impl/CategoryHierarchyServiceImpl'
import { TransactionServiceImpl } from './services/impl/TransactionServiceImpl'
import { ItemServiceImpl } from './services/impl/ItemServiceImpl'

import { FinancialSummaryServiceImpl } from './services/impl/FinancialSummaryServiceImpl'
import { NetWorthServiceImpl } from './services/impl/NetWorthServiceImpl'
import { XirrRefreshServiceImpl } from './services/impl/XirrRefreshServiceImpl'
import { XirrQueryServiceImpl } from './services/impl/XirrQueryServiceImpl'

import { SnapshotRefreshServiceImpl } from './services/impl/SnapshotRefreshServiceImpl'
import { featureFlags } from './config/featureFlags'
import { TransactionSemanticServiceImpl } from './services/impl/TransactionSemanticServiceImpl'



/* =========================================================
   UI SERVICE SINGLETONS
   ========================================================= */
import { DashboardUiServiceImpl } from '../src/ui/ui-services/DashboardUiService'
import { AssetCategoryDetailUiServiceImpl } from '../src/ui/ui-services/AssetCategoryDetailUiService'

/* =========================================================
   REPOSITORY SINGLETONS
   ========================================================= */

const categoryRepository = new SQLiteCategoryRepository()
const categoryQueryRepository = new SQLiteCategoryQueryRepository()
const itemRepository = new SQLiteItemRepository()
const transactionRepository = new SQLiteTransactionRepository()
const transactionQueryRepository = new SQLiteTransactionQueryRepository()
const transactionTypeRepository = new SQLiteTransactionTypeRepository()
// const metadataRepository = new SQLiteMetadataRepository()
// const documentRepository = new SQLiteDocumentRepository()
// const contactRepository = new SQLiteContactRepository()
const cacheQueryRepository = new SQLiteCacheQueryRepository()
const backgroundComputationRepository = new SQLiteBackgroundComputationRepository()
// const valuationPolicyRepository = new SQLiteValuationPolicyRepository()
const uiBehaviorRepository = new SQLiteUIBehaviorRepository()
const categoryCapabilityRepository = new SQLiteCategoryCapabilityRepository()

/* =========================================================
   SERVICE SINGLETONS (RAW)
   ========================================================= */

const rawCategoryHierarchyService =
  new CategoryHierarchyServiceImpl(
    categoryRepository,
    categoryQueryRepository,
    categoryCapabilityRepository,
    uiBehaviorRepository
  )

const rawTransactionSemanticService =
  new TransactionSemanticServiceImpl(
    transactionTypeRepository
  )
const rawTransactionService =
  new TransactionServiceImpl(
    transactionRepository,
    rawTransactionSemanticService

  )
const rawItemService =
  new ItemServiceImpl(
    itemRepository
  )
const rawFinancialSummaryService =
  new FinancialSummaryServiceImpl(
    transactionQueryRepository
  )

const rawNetWorthService =
  new NetWorthServiceImpl(
    transactionQueryRepository,
    cacheQueryRepository,
    categoryQueryRepository
  )

const rawXirrRefreshService =
  new XirrRefreshServiceImpl(
    transactionRepository,
    itemRepository,
    rawCategoryHierarchyService
  )
const rawXirrQueryService =
  new XirrQueryServiceImpl(
    cacheQueryRepository
  )

const rawSnapshotRefreshService =
  new SnapshotRefreshServiceImpl(
    backgroundComputationRepository,
    rawXirrRefreshService
  )

/* =========================================================
   LOGGED SERVICE EXPORTS (AOP-style)
   ========================================================= */

export const categoryHierarchyService =
  withLogging(rawCategoryHierarchyService, {
    className: 'CategoryHierarchyService',
    argsAllowlist: {
      getById: ['categoryId'],
    },
    resultAllowlist: {
      getById: ['id', 'name'],
    },
  })

export const transactionSemanticService =
  withLogging(rawTransactionSemanticService, {
    className: 'TransactionSemanticService',
  })
export const transactionService =
  withLogging(rawTransactionService, {
    className: 'TransactionService',
  })
export const itemService =
  withLogging(rawItemService, {
    className: 'ItemService',
  })
export const financialSummaryService =
  withLogging(rawFinancialSummaryService, {
    className: 'FinancialSummaryService',
  })

export const netWorthService =
  withLogging(rawNetWorthService, {
    className: 'NetWorthService',
    logLevel: 'info',
    enabled: featureFlags.LOG_NET_WORTH,
    argsAllowlist: {
      getSnapshot: ['date'],
    },
  })

export const xirrRefreshService =
  withLogging(rawXirrRefreshService, {
    className: 'XirrRefreshService',
    logLevel: 'warn',
    enabled: featureFlags.LOG_XIRR,
  })
export const xirrQueryService =
  withLogging(rawXirrQueryService, {
    className: 'XirrQueryService',
    logLevel: 'warn',
    enabled: featureFlags.LOG_XIRR,
  })
export const snapshotRefreshService =
  withLogging(rawSnapshotRefreshService, {
    className: 'SnapshotRefreshService',
    logLevel: 'error',
    enabled: featureFlags.LOG_SNAPSHOT_REFRESH,
  })

// =====================================================
// UI SERVICES WIRING
// =====================================================

export const dashboardUiService = new DashboardUiServiceImpl(
  netWorthService,
  xirrQueryService,
  categoryHierarchyService,
  transactionService
);

export const assetCategoryDetailUiService = new AssetCategoryDetailUiServiceImpl(
  netWorthService,
  xirrQueryService,
  itemService,
  transactionService);

