# WealthTracker – Hooks Design

This document defines the **official hook strategy** for the WealthTracker app.
It aligns with Clean Architecture, Cursor rules, and the agreed UI → hooks → services flow.

---

## 🎯 Core Principles

- UI screens MUST NOT import services or container directly.
- UI screens MUST interact with business logic ONLY via hooks.
- Hooks that import services MUST live in `src/hooks`.
- Hooks are divided into:
  - **Feature Hooks (Capability Hooks)**
  - **Screen Hooks (Composition / Use-Case Hooks)**
- Hooks MUST NOT contain business logic.
- Hooks MAY orchestrate service calls but MUST NOT replace services.

---

## 🧠 Mental Model

> **Services = capabilities**  
> **Feature hooks = reusable capability adapters**  
> **Screen hooks = screen-specific orchestration**  
> **Screens = presentation only**

---

## 📁 Folder Structure
src/hooks/
├── features/ # reusable capability hooks
├── screens/ # screen-specific composition hooks
└── system/ # app/system level hooks

---

## ✅ Feature Hooks (Capability Hooks)

Feature hooks wrap **one primary domain capability** and are **reusable across screens**.

### 💰 Net Worth & Performance

#### `useNetWorth`
- **Service**: `netWorthService`
- **Used by**: Dashboard, Portfolio, Reports
- **Responsibility**:
  - Net worth snapshot
  - Assets vs liabilities
  - Trend data (if exposed)

---

#### `useXirr`
- **Service**: `xirrRefreshService`
- **Used by**: Dashboard, Portfolio, Investment details
- **Responsibility**:
  - XIRR values
  - Refresh state

---

### 📂 Categories & Structure

#### `useCategoryHierarchy`
- **Service**: `categoryHierarchyService`
- **Used by**: Category screens, Item creation, Filters
- **Responsibility**:
  - Category tree
  - Capabilities
  - UI behavior metadata

---

### 🧾 Transactions

#### `useTransactions`
- **Service**: transaction service / repository (via container)
- **Used by**: Transactions list, Dashboard (recent transactions)
- **Responsibility**:
  - Fetch recent / filtered transactions
  - Pagination / limits

---

#### `useTransactionSemantics`
- **Service**: `transactionSemanticService`
- **Used by**: Transaction create/edit, Dashboard summaries
- **Responsibility**:
  - Transaction classification
  - Semantic labeling

---

### 🔄 Refresh & Background Jobs

#### `useSnapshotRefresh`
- **Service**: `snapshotRefreshService`
- **Used by**: Pull-to-refresh, background sync
- **Responsibility**:
  - Trigger recomputation
  - Expose refresh status

---

### 🧠 UI Metadata / Behavior

#### `useUIBehavior`
- **Service**: UI behavior service / repository
- **Used by**: Forms, conditional UI
- **Responsibility**:
  - UI hints
  - Feature flags
  - Behavior metadata

---

## 🖥 Screen Hooks (Composition / Use-Case Hooks)

Screen hooks orchestrate **multiple feature hooks or services** for a **single screen**.
They are **NOT intended for reuse** across screens.

---

### 📊 Dashboard

#### `useDashboard` ✅
- **Composes**:
  - `useNetWorth`
  - `useXirr`
  - `useTransactions` (recent)
- **Responsibility**:
  - Aggregate all dashboard data
  - Single loading / error state
  - Read-only orchestration

---

### 📁 Portfolio / Assets Screen

#### `usePortfolioOverview`
- **Composes**:
  - `useNetWorth`
  - `useCategoryHierarchy`
  - `useXirr`
- **Responsibility**:
  - Category-wise values
  - Performance per bucket

---

### 🧾 Transactions Screen

#### `useTransactionsScreen`
- **Composes**:
  - `useTransactions`
  - `useTransactionSemantics`
- **Responsibility**:
  - Filters
  - Sorting
  - UI-ready transaction list

---

### ➕ Add / Edit Item Screen

#### `useItemEditor`
- **Composes**:
  - `useCategoryHierarchy`
  - `useUIBehavior`
- **Responsibility**:
  - Form orchestration
  - UI-side validation coordination

---

### ⚙️ Settings / Support

#### `useLogExport` ✅
- **Uses**:
  - `exportLogsForSupport`
- **Responsibility**:
  - User-triggered log export
  - Export progress state

---

## 🧩 System Hooks

System hooks are UI-facing but **not tied to a single screen**.

---

### `useAppBootstrap`
- **Used by**: Root layout / App entry
- **Responsibility**:
  - Remote config initialization
  - One-time startup tasks
  - Preload critical data

---

### `useTheme`
- **Used by**: All UI
- **Responsibility**:
  - Current theme
  - Theme switching
  - Theme persistence

---

## 🚫 What Hooks MUST NOT Do

- ❌ Contain business rules
- ❌ Directly access repositories or DB
- ❌ Replace domain services
- ❌ Be created inside `components/`

---

## 🔒 Cursor Enforcement Rules (Summary)

- Hooks that import services MUST live in `src/hooks`.
- Feature hooks map to ONE domain capability.
- Screen hooks may compose multiple feature hooks or services.
- Screens MUST NOT orchestrate services directly.
- Screens MUST NOT import `container.ts`.

---

## 📌 Notes

- New screens MUST introduce a screen hook.
- New reusable capabilities MUST introduce a feature hook.
- Avoid creating “fake services” for UI convenience.
- Prefer composition hooks over bloated services.

---

_Last updated: keep this document in sync with Cursor rules and TODO list._
