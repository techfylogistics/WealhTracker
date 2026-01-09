# Services Contract (Domain → UI)

This document describes **all domain services** exposed by the application.
It is the **single source of truth** for UI developers and AI tools (Cursor, Copilot).

> UI must **never** access repositories or database directly.
> UI interacts **only** through these services (via hooks / UI services).

---

## 1️⃣ CRUD Services (Core Entities)

### ItemService

**Purpose**
Manage asset / investment items.

**Used by**
- Add Asset screen
- Asset Detail screen
- Category listing screens

**Methods**
- `createItem(input)`
- `updateItem(item)`
- `deleteItem(itemId)`
- `getItem(itemId)`
- `listItemsByCategory(categoryId)`

**UI Rules**
- No calculations
- No derived metrics
- Call snapshot refresh after mutations

---

### CategoryService

**Purpose**
Manage category structure (create/update/delete only).

**Used by**
- Category management screens

**Methods**
- `createCategory(input)`
- `updateCategory(category)`
- `deleteCategory(categoryId)`

**UI Rules**
- Tree traversal handled elsewhere
- UI must not compute hierarchy

---

### TransactionService

**Purpose**
Manage financial transactions for items.

**Used by**
- Add Transaction flow
- Recent activity feeds

**Methods**
- `addTransaction(input)`
- `updateTransaction(txn)`
- `deleteTransaction(txnId)`
- `listTransactionsForItem(itemId)`
- `txnListLatest5()`

**UI Rules**
- Transaction meaning resolved via TransactionSemanticService
- Refresh summaries after mutations

---

### ContactService

**Purpose**
Manage contacts linked to assets.

**Used by**
- Asset Detail screen
- Contact linking UI

**Methods**
- `createContact(input)`
- `getContact(contactId)`
- `listContacts()`
- `linkContactToItem(itemId, contactId, roleCode)`

---

### DocumentService

**Purpose**
Manage documents attached to assets.

**Used by**
- Asset Detail → Documents section

**Methods**
- `addDocument(input)`
- `listDocuments(itemId)`
- `deleteDocument(documentId)`

---

## 2️⃣ Category Hierarchy & Inheritance

### CategoryHierarchyService

**Purpose**
Resolve category tree, inheritance, and feature availability.

**Used by**
- Category navigation
- Feature toggling in UI
- Capability-driven screens

**Methods**
- `getAncestors(categoryId)`
- `getDescendants(categoryId)`
- `isLeafCategory(categoryId)`
- `getCategoryTree()`
- `getLeafCategoryIds()`
- `getEffectiveCategoryCapability(categoryId)`
- `getEffectiveUIBehavior(categoryId)`

**UI Rules**
- UI must never hardcode category logic
- Always ask this service

---

## 3️⃣ Transaction Semantics

### TransactionSemanticService

**Purpose**
Interpret transaction meaning (return, expense, etc).

**Used by**
- Add Transaction validation
- Transaction labeling
- Conditional UI logic

**Methods**
- `validateTransactionType(txnTypeCode)`
- `isReturnTransaction(txnTypeCode)`
- `isExpenseTransaction(txnTypeCode)`
- `affectsXirr(txnTypeCode)`
- `affectsNetworth(txnTypeCode)`

**UI Rules**
- UI must not infer semantics from codes
- Always query this service

---

## 4️⃣ Financial Summaries

### FinancialSummaryService

**Purpose**
Provide item-level financial aggregates.

**Used by**
- Asset Detail summary cards

**Methods**
- `getItemSummary(itemId)`

**Returns**
- Invested amount
- Returns
- Expenses
- Net gain

**UI Rules**
- No calculations in UI
- Values are final

---

## 5️⃣ Net Worth Queries

### NetWorthService

**Purpose**
Provide net worth snapshots and trends.

**Used by**
- Dashboard
- Trends screens

**Methods**
- `getLatest()`
- `getTrend()`
- `getMoMTrend()`
- `getCategoryNetWorthSnapshot(snapshotDate)`
- `getOverallNetWorthSnapshot(snapshotDate)`

**UI Rules**
- UI renders snapshots only
- No aggregation logic

---

## 6️⃣ XIRR (Read-Only)

### XirrQueryService

**Purpose**
Read cached XIRR values.

**Used by**
- Dashboard
- Item / Category detail screens

**Methods**
- `getXirr(scopeType, scopeId?)`
- `getAllXirr(scopeType)`

**Scope Types**
- `ITEM`
- `CATEGORY`
- `OVERALL`

---

## 7️⃣ XIRR Computation (Background Only)

### XirrRefreshService

**Purpose**
Compute and refresh XIRR values.

**Used by**
- Background jobs
- Snapshot refresh orchestration

**Methods**
- `xirrRefreshOverall()`
- `xirrRefreshForAllCategories()`
- `xirrRefreshForAllItems()`
- `xirrRefreshAll()`
- `computeForItem(itemId)`
- `computeForCategory(categoryId)`
- `computeOverall()`

🚫 **UI MUST NEVER CALL THIS SERVICE**

---

## 8️⃣ Snapshot / Cache Orchestration

### SnapshotRefreshService

**Purpose**
Refresh derived data after mutations.

**Used by**
- Add / Update / Delete flows
- Import flows

**Methods**
- `refreshItemSummaries()`
- `refreshNetWorth()`
- `refreshCategoryNetWorth()`
- `refreshXirr()`
- `refreshAll()`

🚫 **Not used directly for rendering**

---

## 🧭 How UI Should Use This

