/* =========================================================
   CATEGORY & HIERARCHY
   ========================================================= */

export type FinancialNature = 'ASSET' | 'LIABILITY';

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  natureCode: FinancialNature;
}

export interface CategoryRepository {
  getById(id: number): Promise<Category | null>;
  getChildren(parentId: number | null): Promise<Category[]>;
  getAncestors(categoryId: number): Promise<Category[]>;
  getDescendants(categoryId: number): Promise<Category[]>;
  isLeaf(categoryId: number): Promise<boolean>;
}

/* =========================================================
   ITEM (ASSET / LIABILITY / INSURANCE)
   ========================================================= */

export interface Item {
  id: number;
  categoryId: number;     // must be a leaf category
  name: string;
  description?: string;
  currency: string;
  isCash: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ItemRepository {
  create(item: Omit<Item, 'id' | 'createdAt'>): Promise<number>;
  update(item: Item): Promise<void>;
  delete(itemId: number): Promise<void>;
  getById(itemId: number): Promise<Item | null>;
  listByCategory(categoryId: number): Promise<Item[]>;
  listAllActive(): Promise<Item[]>;
}

/* =========================================================
   TRANSACTION TYPE (SEMANTIC MASTER)
   ========================================================= */

export type TransactionGroup =
  | 'INVESTMENT'
  | 'RETURN'
  | 'EXPENSE'
  | 'VALUATION'
  | 'TRANSFER';

export interface TransactionType {
  code: string;
  label: string;
  isCashflow: boolean;
  isReturn: boolean;
  isExpense: boolean;
  affectsXirr: boolean;
  affectsNetworth: boolean;
  groupCode: TransactionGroup;
}

export interface TransactionTypeRepository {
  getByCode(code: string): Promise<TransactionType | null>;
  listAll(): Promise<TransactionType[]>;
  listReturns(): Promise<TransactionType[]>;
  listExpenses(): Promise<TransactionType[]>;
}

/* =========================================================
   TRANSACTIONS (WRITE + BASIC READ)
   ========================================================= */

export interface Transaction {
  id: number;
  itemId: number;
  txnDate: string;
  amount: number;          // SIGNED
  txnTypeCode: string;
  notes?: string;
}

export interface TransactionRepository {
  add(txn: Omit<Transaction, 'id'>): Promise<number>;
  update(txn: Transaction): Promise<void>;
  delete(txnId: number): Promise<void>;
  listByItem(itemId: number): Promise<Transaction[]>;
  listByItemAndType(
    itemId: number,
    txnTypeCodes: string[]
  ): Promise<Transaction[]>;
  listForXirr(itemId: number): Promise<{ date: string; amount: number }[]>;
}

/* =========================================================
   TRANSACTION AGGREGATION / QUERY REPOSITORY
   ========================================================= */

export interface TransactionQueryRepository {
  sumByItemAndType(
    itemId: number,
    txnTypeCodes: string[]
  ): Promise<number>;

  sumByItemAndGroup(
    itemId: number,
    groupCode: TransactionGroup
  ): Promise<number>;

  getItemFinancialBreakdown(itemId: number): Promise<{
    invested: number;
    returns: number;
    expenses: number;
  }>;

  sumByCategory(
    categoryId: number,
    groupCode: TransactionGroup
  ): Promise<number>;

  sumForNetworth(): Promise<{
    assets: number;
    liabilities: number;
  }>;
  networthTrend(): Promise<Array<{
    date: string;
    value: number;
  }>>;

  networthMoM(): Promise<Array<{
    value: number;
  }>>;
  
  networthByDate(): Promise<Array<{
    date: string;
    value: number;
  }>>;
}

/* =========================================================
   METADATA (FORM-DRIVEN UI)
   ========================================================= */

export type MetadataType =
  | 'TEXT'
  | 'NUMBER'
  | 'DATE'
  | 'BOOLEAN'
  | 'LOCATION'
  | 'FILE';

export interface MetadataDefinition {
  key: string;
  label: string;
  dataType: MetadataType;
  applicableCategoryId: number | null;
  isRequired: boolean;
  displayOrder?: number;
}

export interface ItemMetadata {
  itemId: number;
  key: string;
  value: string | null;
}

export interface MetadataRepository {
  getDefinitionsForCategory(categoryId: number): Promise<MetadataDefinition[]>;
  getItemMetadata(itemId: number): Promise<ItemMetadata[]>;
  saveItemMetadata(itemId: number, values: ItemMetadata[]): Promise<void>;
}

/* =========================================================
   CONTACTS
   ========================================================= */

export type ContactCategory =
  | 'INDIVIDUAL'
  | 'FINANCIAL_INSTITUTE'
  | 'GOVT';

export interface Contact {
  id: number;
  name: string;
  category: ContactCategory;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface ContactRepository {
  create(contact: Omit<Contact, 'id'>): Promise<number>;
  getById(id: number): Promise<Contact | null>;
  listAll(): Promise<Contact[]>;
  linkToItem(
    itemId: number,
    contactId: number,
    roleCode: string
  ): Promise<void>;
}

/* =========================================================
   DOCUMENTS
   ========================================================= */

export interface Document {
  id: number;
  itemId: number;
  docTypeCode: string;
  filePath: string;
  uploadedAt: string;
}

export interface DocumentRepository {
  add(doc: Omit<Document, 'id' | 'uploadedAt'>): Promise<number>;
  listByItem(itemId: number): Promise<Document[]>;
  delete(documentId: number): Promise<void>;
}

/* =========================================================
   READ-OPTIMIZED CACHE (UI FACING)
   ========================================================= */

export interface CacheQueryRepository {
  getLatestNetworth(): Promise<{
    totalAssets: number;
    totalLiabilities: number;
    networth: number;
  } | null>

  getCategorySnapshot(date: string): Promise<Array<{
    categoryId: number;
    value: number;
  }>>

  getItemSummary(itemId: number): Promise<{
    invested: number;
    returns: number;
    expenses: number;
    netGain: number;
  } | null>;

  getXirr(
    scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL',
    scopeId?: number
  ): Promise<number | null>;
}

/* =========================================================
   BACKGROUND COMPUTATION (WRITE-SIDE CACHE REFRESH)
   ========================================================= */

export interface BackgroundComputationRepository {
  refreshItemCurrentValues(): Promise<void>;
  refreshItemFinancialSummaries(): Promise<void>;
  refreshNetworthSnapshot(date: string): Promise<void>;
  refreshCategoryNetworthSnapshot(date: string): Promise<void>;
  refreshXirrCache(): Promise<void>;
}
/* =========================================================
   CATEGORY QUERY / READ MODELS
   ========================================================= */

export interface CategoryQueryRepository {

  getLeafCategories(): Promise<number[]>;

  getCategoryTree(): Promise<Array<{
    id: number;
    name: string;
    parentId: number | null;
    natureCode: 'ASSET' | 'LIABILITY';
  }>>;

  getCategoryNetworthSnapshot(
    snapshotDate: string
  ): Promise<Array<{
    categoryId: number;
    value: number;
  }>>;
}
/* =========================================================
   VALUATION POLICY (CATEGORY-LEVEL CONFIG)
   ========================================================= */

export type ValuationFrequency =
  | 'DAILY'
  | 'MONTHLY'
  | 'MANUAL';

export interface ValuationPolicy {
  categoryId: number;
  valuationFrequency: ValuationFrequency;
  allowManualOverride: boolean;
}

export interface ValuationPolicyRepository {

  getByCategory(categoryId: number): Promise<ValuationPolicy | null>;

  listAll(): Promise<ValuationPolicy[]>;
}
/* =========================================================
   UI BEHAVIOR (CATEGORY-LEVEL CONFIG)
   ========================================================= */

export interface UIBehavior {
  categoryId: number;
  showMapPicker: boolean;
  showSmsBalance: boolean;
  showImport: boolean;
}

export interface UIBehaviorRepository {

  getByCategory(categoryId: number): Promise<UIBehavior | null>;

  listAll(): Promise<UIBehavior[]>;
}
/* =========================================================
   CATEGORY CAPABILITY (FEATURE FLAGS)
   ========================================================= */

export interface CategoryCapability {
  categoryId: number;
  supportsLocation: boolean;
  supportsDocuments: boolean;
  supportsReturns: boolean;
  supportsValuation: boolean;
  supportsImport: boolean;
}

export interface CategoryCapabilityRepository {

  getByCategory(categoryId: number): Promise<CategoryCapability | null>;

  listAll(): Promise<CategoryCapability[]>;
}
