Perfect — I’ll convert your inputs into a **complete, production-grade UI Screen Spec** using the **exact template and rigor** we discussed earlier.

You can copy this **as-is** into:

```
docs/screens/dashboard.md
```

This becomes the **single contract** for UI devs + Cursor.

---

# 📊 Dashboard Screen — UI Specification

## 1️⃣ Screen Name

**Dashboard**

---

## 2️⃣ Purpose (Why this screen exists)

The Dashboard provides a **high-level financial snapshot** of the user.

It answers:

* What is my **current net worth**?
* How much do I own (**assets**) vs owe (**liabilities**)?
* How are assets and liabilities **allocated by category**?
* What are my **overall returns (XIRR)**?
* How is my net worth changing **month-over-month**?
* What are my **most recent transactions**?

This is the **primary landing screen** of the app.

---

## 3️⃣ What the Screen Shows (Visual Sections)

### A. Header

* Title: **Dashboard**
* Subtitle: User name (e.g., “Dashboard – Rahul”)

---

### B. Donut Chart (Dual Ring)

* **Outer ring** → Asset category allocation
* **Inner ring** → Liability category allocation
* Color-coded by category (consistent across UI)

---

### C. Center of Donut

* **Overall Net Worth**
* **Overall XIRR (%)**

---

### D. Totals Below Donut

* Left: **Total Assets**
* Right: **Total Liabilities**

---

### E. Trends Shortcut

* Clickable icon/button
* Navigates to **Net Worth Trends screen**
* Shows **Month-over-Month % change**

  * Asset MoM (left)
  * Liability MoM (right)

---

### F. Recent Transactions

* Heading: **Recent Transactions**
* Right-aligned **Add (+)** button
* List of latest 5 transactions:

  * Transaction title
  * Amount (signed + / −)

---

### G. Assets – Category Cards (Horizontal Scroll)

* Section title: **Assets**
* Right-aligned **Add Asset (+)** button
* One card per asset category:

  * Category name
  * Category total value
  * Category XIRR (%)
* Card color = category color (same as donut)

---

### H. Liabilities – Category Cards (Horizontal Scroll)

* Section title: **Liabilities**
* Right-aligned **Add Liability (+)** button
* One card per liability category:

  * Category name
  * Category total value
  * Category interest/XIRR
* Card color = liability category color

---

## 4️⃣ View Models Required (UI Contracts)

### DashboardViewModel

```ts
export type DashboardViewModel = {
  userName: string;

  netWorth: number;
  netWorthXirr: number | null;

  totalAssets: number;
  totalLiabilities: number;

  assetMoMChangePct: number | null;
  liabilityMoMChangePct: number | null;

  donut: {
    assets: DonutSliceVM[];
    liabilities: DonutSliceVM[];
  };

  recentTransactions: RecentTransactionVM[];

  assetCategoryCards: CategoryCardVM[];
  liabilityCategoryCards: CategoryCardVM[];
};
```

---

### Supporting View Models

```ts
export type DonutSliceVM = {
  categoryId: number;
  categoryName: string;
  value: number;
  color: string;
};

export type CategoryCardVM = {
  categoryId: number;
  categoryName: string;
  value: number;
  xirr: number | null;
  color: string;
};

export type RecentTransactionVM = {
  transactionId: number;
  title: string;
  amount: number;
  date: string;
};
```

---

## 5️⃣ UI Services Required

### DashboardUiService

**Responsibility**

* Fetch data from domain/query services
* Map domain/query models → DashboardViewModel
* Perform **no calculations**, only formatting/mapping

**Methods**

```ts
export interface DashboardUiService {
  getDashboardVM(): Promise<DashboardViewModel>;
}
```

**Uses (internally)**

* `NetWorthService`
* `XirrQueryService`
* `CategoryHierarchyService`
* `TransactionService`
* `NetWorthService.getMoMTrend()`
* Category net worth snapshots
* XIRR cache (category + overall)

---

## 6️⃣ Hooks Required

### `useDashboard()`

```ts
export function useDashboard() {
  return {
    data: DashboardViewModel | null;
    loading: boolean;
    error: Error | null;
    refresh: () => void;
  };
}
```

**Hook rules**

* Calls `DashboardUiService.getDashboardVM()`
* Handles loading / error / retry
* No transformation logic inside hook

---

## 7️⃣ Components Used

### Major Components

* `<DashboardHeader />`
* `<DualRingDonutChart />`
* `<NetWorthCenterSummary />`
* `<TotalsBar />`
* `<TrendShortcut />`
* `<RecentTransactionsList />`
* `<CategoryCardCarousel />`

### Reusable Components

* `<CategoryCard />`
* `<TransactionRow />`
* `<SectionHeader />`

---

## 8️⃣ User Actions

| Action              | Result                             |
| ------------------- | ---------------------------------- |
| Tap Add Transaction | Navigate to Add Transaction screen |
| Tap Add Asset       | Navigate to Add Asset screen       |
| Tap Category Card   | Navigate to Category Detail screen |
| Tap Trends Icon     | Navigate to Trends screen          |
| Pull to Refresh     | Reload dashboard data              |

---

## 9️⃣ Screen States

### Loading

* Skeletons / shimmer placeholders

### Empty

* “No assets added yet”
* CTA to add first asset

### Partial

* Assets present, liabilities empty (or vice versa)

### Error

* Non-blocking error message
* Retry button

---

## 🔟 What This Screen MUST NOT Do

❌ Must NOT compute net worth
❌ Must NOT compute XIRR
❌ Must NOT traverse category hierarchy
❌ Must NOT call repositories or SQLite
❌ Must NOT contain business logic

All numbers are **final values from services**.

---

## 1️⃣1️⃣ Navigation Targets

* Add Asset
* Add Transaction
* Category Detail
* Net Worth Trends

---

## 1️⃣2️⃣ Cursor / AI Usage Note

Recommended prompt:

> Use `docs/screens/dashboard.md`
> Use `DashboardViewModel` only
> Do not add calculations
> Fetch data via `useDashboard()`
> Respect UI guardrails

---

## ✅ Summary

The Dashboard screen is:

* Data-rich
* Performance-sensitive
* Read-only
* Snapshot-driven

This spec is the **contract** between:

* Domain → UI
* Humans → AI tools

---

If you want next, I can:

* Generate `DashboardUiService` implementation
* Generate `useDashboard()` hook
* Generate skeleton UI components
* Design donut chart data contract
* Create Figma-style mockups

Just tell me 👍
