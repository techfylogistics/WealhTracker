/* =========================================================
   CATEGORY HIERARCHY & INHERITANCE
   ========================================================= */

export interface CategoryHierarchyService {

  getAncestors(categoryId: number): Promise<number[]>;

  getDescendants(categoryId: number): Promise<number[]>;

  isLeafCategory(categoryId: number): Promise<boolean>;

  getEffectiveCategoryCapability(categoryId: number): Promise<{
    supportsLocation: boolean;
    supportsDocuments: boolean;
    supportsReturns: boolean;
    supportsValuation: boolean;
    supportsImport: boolean;
  }>;

  getEffectiveUIBehavior(categoryId: number): Promise<{
    showMapPicker: boolean;
    showSmsBalance: boolean;
    showImport: boolean;
  }>;

    getCategoryTree(): Promise<
    Array<{
      id: number;
      name: string;
      parentId: number | null;
      natureCode: 'ASSET' | 'LIABILITY';
    }>
  >;

  getLeafCategoryIds(): Promise<number[]>;

}
/* =========================================================
   TRANSACTION SEMANTICS & VALIDATION
   ========================================================= */

export interface TransactionSemanticService {

  validateTransactionType(
    txnTypeCode: string
  ): Promise<void>;

  isReturnTransaction(
    txnTypeCode: string
  ): Promise<boolean>;

  isExpenseTransaction(
    txnTypeCode: string
  ): Promise<boolean>;

  affectsXirr(
    txnTypeCode: string
  ): Promise<boolean>;

  affectsNetworth(
    txnTypeCode: string
  ): Promise<boolean>;
}
/* =========================================================
   FINANCIAL SUMMARY (ITEM-LEVEL)
   ========================================================= */

export interface FinancialSummary {
  invested: number;
  returns: number;
  expenses: number;
  netGain: number;
}

export interface FinancialSummaryService {

  getItemSummary(
    itemId: number
  ): Promise<FinancialSummary>;
}
/* =========================================================
   NET WORTH (AGGREGATED VIEW)
   ========================================================= */

export interface NetWorthSnapshot {
  totalAssets: number;
  totalLiabilities: number;
  networth: number;
}

export interface NetWorthTrendPoint {
  date: string;
  networth: number;
}

export interface CategoryNetWorth {
  categoryId: number;
  value: number;
}
export interface NetWorth {
  value: number;
}
export interface NetWorthService {

  getLatest(): Promise<NetWorthSnapshot>;

  getTrend(): Promise<NetWorthTrendPoint[]>;
  getMoMTrend(): Promise<NetWorth[]>;

  getCategoryNetWorth(
    snapshotDate: string
  ): Promise<CategoryNetWorth[]>;

  getOverallNetWorth(
    snapshotDate: string
  ): Promise<{ value: number }>;

}
/* =========================================================
   XIRR (RETURN CALCULATIONS)
   ========================================================= */

export interface XirrService {

  computeForItem(
    itemId: number
  ): Promise<number | null>;

  computeForCategory(
    categoryId: number
  ): Promise<number | null>;

  computeOverall(): Promise<number | null>;
}
/* =========================================================
   SNAPSHOT / CACHE ORCHESTRATION (PHASE 2)
   ========================================================= */

export interface SnapshotRefreshService {

  refreshItemSummaries(): Promise<void>;

  refreshNetWorth(): Promise<void>;

  refreshCategoryNetWorth(): Promise<void>;

  refreshXirr(): Promise<void>;

  refreshAll(): Promise<void>;
}
