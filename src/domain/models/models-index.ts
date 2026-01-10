// ================================
// CATEGORY
// ================================

// import { CategoryNature } from "../src/motypes/CategoryNature";
import { CategoryNature } from "@/src/types/CategoryNature";
import { ContactCategory } from "@/src/types/ContactCategory";
import { MetadataType } from "@/src/types/MetadataType";
import { ScopeType } from "@/src/types/ScopeType";
import { TransactionGroup } from "@/src/types/TransactionGroup";



export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  natureCode: CategoryNature;
}

// ================================
// ITEM (Asset / Liability)
// ================================

// export interface Item {
//   id: number;
//   name: string;
//   categoryId: number;
//   acquisitionDate: string; // YYYY-MM-DD
//   notes?: string | null;
// }

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

// ================================
// TRANSACTION
// ================================

export interface Transaction {
  id: number;
  itemId: number;
  txnDate: string; // YYYY-MM-DD
  amount: number; // +ve or -ve depending on type
  txnTypeCode: string;
  notes?: string | null;
}


// ================================
// TRANSACTION TYPE (SEMANTICS)
// ================================



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

// ================================
// CONTACT
// ================================

export interface Contact {
  id: number;
  name: string;
  category: ContactCategory;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
}

// ================================
// DOCUMENT
// ================================

export interface ItemDocument {
  id: number;
  itemId: number;
  docTypeCode: string;
  filePath: string;
  uploadedAt: string; // ISO date
}
// export interface Document {
//   id: number;
//   itemId: number;
//   docTypeCode: string;
//   filePath: string;
//   uploadedAt: string;
// }
// ================================
// METADATA
// ================================



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
  value: string;
}

// ================================
// SNAPSHOTS
// ================================

export interface CategoryNetworthSnapshot {
  categoryId: number;
  snapshotDate: string; // YYYY-MM-DD
  value: number;
}

export interface ItemNetworthSnapshot {
  itemId: number;
  snapshotDate: string;
  value: number;
}

// ================================
// XIRR CACHE
// ================================


export interface XirrCache {
  scopeType: ScopeType;
  scopeId: number | null;
  xirr: number;
  lastComputed: string; // YYYY-MM-DD
}
