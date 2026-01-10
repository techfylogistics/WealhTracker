/* =========================================================
   CRUD OPERATIONS ON CORE DOMAIN ENTITIES
   ========================================================= */

import { FinancialSummary, NetWorth, CategoryNetWorth, XIRRbyScope, NetWorthSnapshot, NetWorthTrendPoint } from "@/src/query-models/query-models-index";
import { Category, Item, Transaction, Contact, ItemDocument } from "@/src/domain/models/models-index";

/**
 * ItemService
 *
 * Manages CRUD operations for investment items (assets).
 *
 * UI usage:
 * - Add / Edit Asset flows
 * - Asset Detail screen
 *
 * Notes:
 * - No financial calculations
 * - No aggregation logic
 */
export interface ItemService {

  /**
   * Create a new investment item.
   * Used when user adds a new asset.
   */
  createItem(input: Omit<Item, 'id'>): Promise<number>;

  /**
   * Update item metadata (name, category, etc.).
   */
  updateItem(item: Item): Promise<void>;

  /**
   * Delete an item permanently.
   * Cascading cleanup handled internally.
   */
  deleteItem(itemId: number): Promise<void>;

  /**
   * Fetch a single item by id.
   */
  getItem(itemId: number): Promise<Item | null>;

  /**
   * List all items under a given category.
   */
  listItemsByCategory(categoryId: number): Promise<Item[]>;
}

/**
 * CategoryService
 *
 * Handles CRUD operations on categories.
 *
 * UI usage:
 * - Category management
 *
 * Notes:
 * - Hierarchy traversal is NOT handled here
 */
export interface CategoryService {

  /**
   * Create a new category.
   */
  createCategory(input: Omit<Category, 'id'>): Promise<number>;

  /**
   * Update category properties.
   */
  updateCategory(category: Category): Promise<void>;

  /**
   * Delete a category.
   * Caller must ensure no dependent items.
   */
  deleteCategory(categoryId: number): Promise<void>;
}

/**
 * TransactionService
 *
 * Handles CRUD operations for transactions.
 *
 * UI usage:
 * - Add Transaction flow
 * - Asset Detail screen
 *
 * Notes:
 * - Transaction meaning is resolved elsewhere
 */
export interface TransactionService {

  /**
   * Add a new transaction for an item.
   */
  addTransaction(input: Omit<Transaction, 'id'>): Promise<number>;

  /**
   * Update an existing transaction.
   */
  updateTransaction(txn: Transaction): Promise<void>;

  /**
   * Delete a transaction.
   */
  deleteTransaction(txnId: number): Promise<void>;

  /**
   * List all transactions belonging to an item.
   */
  listTransactionsForItem(itemId: number): Promise<Transaction[]>;

  /**
   * Get the latest 5 transactions across all items.
   * Used for dashboard activity feed.
   */
  txnListLatest5(): Promise<Transaction[]>;
}

/**
 * ContactService
 *
 * Manages contacts linked to assets.
 *
 * UI usage:
 * - Asset Detail screen
 * - Contact linking flows
 */
export interface ContactService {

  /**
   * Create a new contact.
   */
  createContact(input: Omit<Contact, 'id'>): Promise<number>;

  /**
   * Fetch a contact by id.
   */
  getContact(contactId: number): Promise<Contact | null>;

  /**
   * List all contacts.
   */
  listContacts(): Promise<Contact[]>;

  /**
   * Link an existing contact to an item with a role.
   */
  linkContactToItem(
    itemId: number,
    contactId: number,
    roleCode: string
  ): Promise<void>;
}

/**
 * DocumentService
 *
 * Manages documents attached to assets.
 *
 * UI usage:
 * - Asset Detail screen
 */
export interface DocumentService {

  /**
   * Add a document to an item.
   */
  addDocument(input: Omit<ItemDocument, 'id' | 'uploadedAt'>): Promise<number>;

  /**
   * List documents attached to an item.
   */
  listDocuments(itemId: number): Promise<ItemDocument[]>;

  /**
   * Delete a document.
   */
  deleteDocument(documentId: number): Promise<void>;
}

/* =========================================================
   CATEGORY HIERARCHY & INHERITANCE
   ========================================================= */

/**
 * CategoryHierarchyService
 *
 * Resolves category tree structure and inherited behavior.
 *
 * UI usage:
 * - Category navigation
 * - Feature enablement
 */
export interface CategoryHierarchyService {

  /**
   * Get all ancestor category IDs.
   * Ordered from immediate parent upwards.
   */
  getAncestors(categoryId: number): Promise<number[]>;

  /**
   * Get all descendant category IDs recursively.
   */
  getDescendants(categoryId: number): Promise<number[]>;

  /**
   * Check if category has no children.
   */
  isLeafCategory(categoryId: number): Promise<boolean>;

  /**
   * Resolve effective category capabilities after inheritance.
   * Used to enable or disable features in UI.
   */
  getEffectiveCategoryCapability(categoryId: number): Promise<{
    supportsLocation: boolean;
    supportsDocuments: boolean;
    supportsReturns: boolean;
    supportsValuation: boolean;
    supportsImport: boolean;
  }>;

  /**
   * Resolve effective UI behavior flags after inheritance.
   */
  getEffectiveUIBehavior(categoryId: number): Promise<{
    showMapPicker: boolean;
    showSmsBalance: boolean;
    showImport: boolean;
  }>;

  /**
   * Return the full category tree for navigation.
   */
  getCategoryTree(): Promise<Array<{
    id: number;
    name: string;
    parentId: number | null;
    natureCode: 'ASSET' | 'LIABILITY';
  }>>;

  /**
   * Get all leaf category IDs.
   */
  getLeafCategoryIds(): Promise<number[]>;
}

/* =========================================================
   TRANSACTION SEMANTICS & VALIDATION
   ========================================================= */

/**
 * TransactionSemanticService
 *
 * Interprets transaction meaning and validation rules.
 *
 * UI usage:
 * - Add Transaction validation
 * - Transaction labeling
 */
export interface TransactionSemanticService {

  /**
   * Validate transaction type code.
   * Throws if invalid.
   */
  validateTransactionType(txnTypeCode: string): Promise<void>;

  /**
   * Check if transaction represents a return.
   */
  isReturnTransaction(txnTypeCode: string): Promise<boolean>;

  /**
   * Check if transaction represents an expense.
   */
  isExpenseTransaction(txnTypeCode: string): Promise<boolean>;

  /**
   * Whether transaction affects XIRR.
   */
  affectsXirr(txnTypeCode: string): Promise<boolean>;

  /**
   * Whether transaction affects net worth.
   */
  affectsNetworth(txnTypeCode: string): Promise<boolean>;
}

/* =========================================================
   FINANCIAL SUMMARY (ITEM LEVEL)
   ========================================================= */

/**
 * FinancialSummaryService
 *
 * Provides aggregated financial metrics for an item.
 *
 * UI usage:
 * - Asset Detail screen
 */
export interface FinancialSummaryService {

  /**
   * Get invested, returns, expenses and net gain for an item.
   */
  getItemSummary(itemId: number): Promise<FinancialSummary>;
}

/* =========================================================
   NET WORTH QUERIES
   ========================================================= */

/**
 * NetWorthService
 *
 * Provides net worth snapshots and trends.
 *
 * UI usage:
 * - Dashboard
 * - Trends screens
 */
export interface NetWorthService {

  /**
   * Get the most recent net worth snapshot.
   */
  getLatest(): Promise<NetWorthSnapshot>;
  /**
    * Get the most recent net worth snapshot for all categories
    */
  getLatestCategoryNetworth(): Promise<CategoryNetWorth[]>;

  /**
  * Get the most recent current value of the item
  */
  getlatestItemCurrentValue(itemId: number): Promise<{ value: number } | null>;

  /**
   * Get historical net worth trend points.
   */
  getTrend(): Promise<NetWorthTrendPoint[]>;

  /**
   * Get month-over-month net worth values.
   */
  getMoMTrend(): Promise<NetWorth[]>;

  /**
   * Get category-level net worth for a snapshot date.
   */
  getCategoryNetWorthSnapshot(snapshotDate: string): Promise<CategoryNetWorth[]>;

  /**
   * Get overall net worth for a snapshot date.
   */
  getOverallNetWorthSnapshot(snapshotDate: string): Promise<{ value: number }>;
}

/* =========================================================
   XIRR QUERY (READ-ONLY)
   ========================================================= */

/**
 * XirrQueryService
 *
 * Read-only access to cached XIRR values.
 *
 * UI usage:
 * - Dashboard
 * - Asset / Category detail screens
 */
export interface XirrQueryService {

  /**
   * Get XIRR for a specific scope.
   */
  getXirr(
    scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL',
    scopeId?: number
  ): Promise<number | null>;

  /**
   * Get all XIRR values for a scope type.
   */
  getAllXirr(
    scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL'
  ): Promise<XIRRbyScope[] | null>;
}

/* =========================================================
   XIRR COMPUTATION & REFRESH
   ========================================================= */

/**
 * XirrRefreshService
 *
 * Performs XIRR calculations and updates cache.
 *
 * UI usage:
 * - NEVER called directly
 */
export interface XirrRefreshService {

  /** Refresh XIRR for entire portfolio */
  xirrRefreshOverall(): Promise<void>;

  /** Refresh XIRR for all categories */
  xirrRefreshForAllCategories(): Promise<void>;

  /** Refresh XIRR for all items */
  xirrRefreshForAllItems(): Promise<void>;

  /** Refresh all XIRR scopes */
  xirrRefreshAll(): Promise<void>;

  /** Compute XIRR for a single item */
  computeForItem(itemId: number): Promise<number | null>;

  /** Compute XIRR for a category including descendants */
  computeForCategory(categoryId: number): Promise<number | null>;

  /** Compute overall portfolio XIRR */
  computeOverall(): Promise<number | null>;
}

/* =========================================================
   SNAPSHOT / CACHE ORCHESTRATION
   ========================================================= */

/**
 * SnapshotRefreshService
 *
 * Orchestrates background refresh of derived data.
 *
 * UI usage:
 * - Triggered after mutations
 * - Never directly used by UI rendering
 */
export interface SnapshotRefreshService {

  /** Refresh item-level summaries */
  refreshItemSummaries(): Promise<void>;

  /** Refresh overall net worth snapshots */
  refreshNetWorth(): Promise<void>;

  /** Refresh category-level net worth snapshots */
  refreshCategoryNetWorth(): Promise<void>;

  /** Refresh cached XIRR values */
  refreshXirr(): Promise<void>;

  /** Refresh all derived snapshots */
  refreshAll(): Promise<void>;
}
