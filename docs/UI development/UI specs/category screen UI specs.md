Perfect — below is a **complete, clean, dashboard-grade UI specification** for the **Asset Category Detail screen**, written in the **same structure, rigor, and tone** as the Dashboard UI spec you approved earlier.

You can copy this **as-is** into:

```
docs/screens/category-assets-detail.md
```

---

# 📊 Assets – Category Detail Screen — UI Specification

## 1️⃣ Screen Name

**Assets – `<Category Name>`**

Example:

* `Assets – Real Estate`
* `Assets – Equity`
* `Assets – Fixed Income`

---

## 2️⃣ Purpose (Why this screen exists)

This screen provides a **deep-dive view into a single Asset category**.

It answers:

* What is the **total value** of assets under this category?
* How are assets **distributed within this category**?
* What is the **category-level XIRR**?
* How is the category performing **month-over-month and over time**?
* What are the **individual asset performances**?
* What are the **recent transactions** related to this category?

This screen is reached from:

* Dashboard → Asset Category card
* Dashboard → Donut chart interaction

---

## 3️⃣ What the Screen Shows (Visual Sections)

### A. Header

* Back button
* Title: **Assets – `<Category Name>`**

---

### B. Donut Chart (Single Ring)

* Single ring donut
* Represents **asset-level breakdown within this category**
* Each slice = one asset
* Color-coded per asset (consistent across UI)

---

### C. Center Summary (Inside Donut)

Displays:

* **Total Category Value**
* **Category XIRR (%)**
* **Month-over-Month Change (%)**

All values are **read-only**, derived from services.

---

### D. Trend Chart (Category Value Over Time)

* Line / area chart
* Shows **total category value over time**
* Default range: **Last 6 months**
* Range selector:

  * 1M
  * 3M
  * 6M (default)
  * 1Y
  * 5Y

---

### E. Recent Transactions

* Section title: **Recent Transactions**
* Right-aligned **Add Transaction (+)** button
* Shows latest 5 transactions related to this category
* Each row displays:

  * Transaction title
  * Asset name
  * Amount (signed)
  * Date

---

### F. Assets in This Category (Horizontal Scroll)

* Section title: **Assets**
* Right-aligned **Add Asset (+)** button
* Horizontal scrolling cards
* Each card displays:

  * Asset name
  * Current value
  * Asset-level XIRR (%)
* Card color matches asset slice color in donut

---

## 4️⃣ View Models Required (UI Contracts)

### AssetCategoryDetailViewModel

```ts
export type AssetCategoryDetailViewModel = {
  categoryId: number;
  categoryName: string;

  totalValue: number;
  categoryXirr: number | null;
  moMChangePct: number | null;

  donut: AssetDonutVM[];

  trend: CategoryTrendPointVM[];

  recentTransactions: CategoryTransactionVM[];

  assets: AssetCardVM[];
};
```

---

### Supporting View Models

```ts
export type AssetDonutVM = {
  assetId: number;
  assetName: string;
  value: number;
  color: string;
};

export type CategoryTrendPointVM = {
  date: string;
  value: number;
};

export type AssetCardVM = {
  assetId: number;
  assetName: string;
  value: number;
  xirr: number | null;
  color: string;
};

export type CategoryTransactionVM = {
  transactionId: number;
  assetName: string;
  title: string;
  amount: number;
  date: string;
};
```

---

## 5️⃣ UI Services Required

### AssetCategoryDetailUiService

**Responsibility**

* Aggregate all data required for a single asset category
* Map domain/query outputs → `AssetCategoryDetailViewModel`
* Perform **no business calculations**

```ts
export interface AssetCategoryDetailUiService {
  getAssetCategoryDetailVM(
    categoryId: number,
    range: '1M' | '3M' | '6M' | '1Y' | '5Y'
  ): Promise<AssetCategoryDetailViewModel>;
}
```

**Uses (internally)**

* `NetWorthService`
* `XirrQueryService`
* `ItemService`
* `TransactionService`
* Category-level trend query (snapshot-based)

---

## 6️⃣ Hooks Required

### `useAssetCategoryDetail(categoryId)`

```ts
export function useAssetCategoryDetail(
  categoryId: number
) {
  return {
    data: AssetCategoryDetailViewModel | null;
    loading: boolean;
    error: Error | null;
    range: '1M' | '3M' | '6M' | '1Y' | '5Y';
    setRange: (r) => void;
    refresh: () => void;
  };
}
```

**Hook rules**

* Calls `AssetCategoryDetailUiService`
* Manages range selection
* No calculations
* No formatting beyond UI concerns

---

## 7️⃣ Components Used

### Major Components

* `<CategoryHeader />`
* `<SingleRingDonutChart />`
* `<CategoryCenterSummary />`
* `<TrendChart />`
* `<RecentTransactionsList />`
* `<AssetCardCarousel />`

### Reusable Components

* `<AssetCard />`
* `<TransactionRow />`
* `<SectionHeader />`
* `<RangeSelector />`

---

## 8️⃣ User Actions

| Action              | Result                                      |
| ------------------- | ------------------------------------------- |
| Tap Back            | Navigate to Dashboard                       |
| Tap Add Asset       | Navigate to Add Asset (pre-filled category) |
| Tap Add Transaction | Navigate to Add Transaction                 |
| Tap Asset Card      | Navigate to Asset Detail                    |
| Change Range        | Reload trend chart                          |
| Pull to Refresh     | Reload category data                        |

---

## 9️⃣ Screen States

### Loading

* Skeleton donut
* Placeholder cards
* Disabled range selector

### Empty

* No assets in category
* CTA to add first asset

### Partial

* Assets exist but no transactions
* No trend data yet

### Error

* Inline error message
* Retry button

---

## 🔟 What This Screen MUST NOT Do

❌ Must NOT compute XIRR
❌ Must NOT compute net worth
❌ Must NOT aggregate values manually
❌ Must NOT access repositories or SQLite
❌ Must NOT infer trends

All values are **final, service-provided data**.

---

## 1️⃣1️⃣ Navigation Targets

* Dashboard
* Add Asset
* Add Transaction
* Asset Detail

---

## 1️⃣2️⃣ Cursor / AI Usage Note

Recommended prompt:

> Use `docs/screens/category-assets-detail.md`
> Use `AssetCategoryDetailViewModel` only
> Fetch data via `useAssetCategoryDetail(categoryId)`
> Do not add calculations or SQL

---

## ✅ Summary

The Asset Category Detail screen:

* Is **category-scoped**
* Is **trend-aware**
* Is **read-heavy**
* Uses **snapshot / cached data**
* Acts as a bridge between Dashboard and Asset Detail

This spec is the **authoritative contract** for this screen.

---

If you want next, I can:

* Generate `AssetCategoryDetailUiService` implementation
* Generate `useAssetCategoryDetail()` hook
* Generate screen skeleton (`AssetsCategoryDetailScreen.tsx`)
* Design trend chart data contracts
* Align colors between donut and cards

Just tell me 👍
