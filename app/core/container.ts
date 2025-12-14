/* =========================================================
   SQLITE REPOSITORIES
   ========================================================= */

import {
  SQLiteCategoryRepository
} from '../repositories/sqlite/SQLiteCategoryRepository';
import {
  SQLiteCategoryQueryRepository
} from '../repositories/sqlite/SQLiteCategoryQueryRepository';
import {
  SQLiteItemRepository
} from '../repositories/sqlite/SQLiteItemRepository';
import {
  SQLiteTransactionRepository
} from '../repositories/sqlite/SQLiteTransactionRepository';
import {
  SQLiteTransactionQueryRepository
} from '../repositories/sqlite/SQLiteTransactionQueryRepository';
import {
  SQLiteTransactionTypeRepository
} from '../repositories/sqlite/SQLiteTransactionTypeRepository';
import {
  SQLiteMetadataRepository
} from '../repositories/sqlite/SQLiteMetadataRepository';
import {
  SQLiteDocumentRepository
} from '../repositories/sqlite/SQLiteDocumentRepository';
import {
  SQLiteContactRepository
} from '../repositories/sqlite/SQLiteContactRepository';
import {
  SQLiteCacheQueryRepository
} from '../repositories/sqlite/SQLiteCacheQueryRepository';
import {
  SQLiteBackgroundComputationRepository
} from '../repositories/sqlite/SQLiteBackgroundComputationRepository';
import {
  SQLiteValuationPolicyRepository
} from '../repositories/sqlite/SQLiteValuationPolicyRepository';
import {
  SQLiteUIBehaviorRepository
} from '../repositories/sqlite/SQLiteUIBehaviorRepository';
import {
  SQLiteCategoryCapabilityRepository
} from '../repositories/sqlite/SQLiteCategoryCapabilityRepository';

/* =========================================================
   DOMAIN SERVICES
   ========================================================= */

import {
  CategoryHierarchyServiceImpl
} from '../services/impl/CategoryHierarchyServiceImpl';
import {
  TransactionSemanticServiceImpl
} from '../services/impl/TransactionSemanticServiceImpl';
import {
  FinancialSummaryServiceImpl
} from '../services/impl/FinancialSummaryServiceImpl';
import {
  NetWorthServiceImpl
} from '../services/impl/NetWorthServiceImpl';
import {
  XirrServiceImpl
} from '../services/impl/XirrServiceImpl';
import {
  SnapshotRefreshServiceImpl
} from '../services/impl/SnapshotRefreshServiceImpl';

/* =========================================================
   REPOSITORY SINGLETONS
   ========================================================= */

export const categoryRepository =
  new SQLiteCategoryRepository();

export const categoryQueryRepository =
  new SQLiteCategoryQueryRepository();

export const itemRepository =
  new SQLiteItemRepository();

export const transactionRepository =
  new SQLiteTransactionRepository();

export const transactionQueryRepository =
  new SQLiteTransactionQueryRepository();

export const transactionTypeRepository =
  new SQLiteTransactionTypeRepository();

export const metadataRepository =
  new SQLiteMetadataRepository();

export const documentRepository =
  new SQLiteDocumentRepository();

export const contactRepository =
  new SQLiteContactRepository();

export const cacheQueryRepository =
  new SQLiteCacheQueryRepository();

export const backgroundComputationRepository =
  new SQLiteBackgroundComputationRepository();

export const valuationPolicyRepository =
  new SQLiteValuationPolicyRepository();

export const uiBehaviorRepository =
  new SQLiteUIBehaviorRepository();

export const categoryCapabilityRepository =
  new SQLiteCategoryCapabilityRepository();

/* =========================================================
   SERVICE SINGLETONS
   ========================================================= */

export const categoryHierarchyService =
  new CategoryHierarchyServiceImpl(
    categoryRepository,
    categoryQueryRepository,
    categoryCapabilityRepository,
    uiBehaviorRepository
  );

export const transactionSemanticService =
  new TransactionSemanticServiceImpl(
    transactionTypeRepository
  );

export const financialSummaryService =
  new FinancialSummaryServiceImpl(
    transactionQueryRepository
  );

export const netWorthService =
  new NetWorthServiceImpl(
    transactionQueryRepository,
    cacheQueryRepository,
    categoryQueryRepository
  );

export const xirrService =
  new XirrServiceImpl(
    transactionRepository,
    transactionQueryRepository,
    categoryRepository,
    cacheQueryRepository
  );

export const snapshotRefreshService =
  new SnapshotRefreshServiceImpl(
    backgroundComputationRepository,
    cacheQueryRepository,
    categoryQueryRepository,
    xirrService
  );
