Below is a **clean, standardized, copy-paste-ready** `usePaginatedAsyncRunner` that:

* Extends the **exact mental model** of `useAsyncRunner`
* Adds **pagination** without breaking consistency
* Is **Cursor / Copilot friendly**
* Works for:

  * infinite scroll
  * “Load more”
  * paginated lists (transactions, assets, documents, etc.)
* Avoids imperative `.run()` patterns

---

## ✅ Design principles (locked)

* Declarative by default
* Explicit pagination controls
* No business logic
* No caching beyond hook lifecycle
* Same return shape philosophy as `useAsyncRunner`

---

## 📁 `usePaginatedAsyncRunner.ts`

````ts
import { useEffect, useState, useCallback } from "react";

/**
 * PaginatedAsyncState
 *
 * Standard return type for paginated async hooks.
 */
export type PaginatedAsyncState<T> = {
  /** Aggregated list of loaded items */
  data: T[];

  /** True while initial load or pagination fetch is in progress */
  loading: boolean;

  /** Error thrown by the async function, if any */
  error: Error | null;

  /** Whether more data is available */
  hasMore: boolean;

  /** Loads the next page */
  loadMore: () => void;

  /** Reloads from page 1 */
  refresh: () => void;
};

/**
 * usePaginatedAsyncRunner
 *
 * A standardized hook for paginated async data loading.
 *
 * ---
 * ### Contract
 * - Fetches page 1 on mount
 * - Appends data when `loadMore()` is called
 * - Resets and refetches on `refresh()`
 * - Stops pagination when `hasMore` is false
 *
 * ---
 * ### Intended Usage
 * Used by **UI hooks only** for lists:
 * - Transactions
 * - Assets
 * - Documents
 * - Activity feeds
 *
 * ---
 * ### Example
 * ```ts
 * const state = usePaginatedAsyncRunner(
 *   ({ page, pageSize }) =>
 *     transactionUiService.listTransactions(itemId, page, pageSize),
 *   [itemId]
 * );
 * ```
 *
 * ---
 * ### Async Function Contract
 * The async function MUST return:
 * ```ts
 * {
 *   items: T[];
 *   hasMore: boolean;
 * }
 * ```
 *
 * ---
 * ### What this hook DOES
 * - Manages pagination state
 * - Aggregates pages
 * - Handles refresh & load-more
 *
 * ---
 * ### What this hook does NOT do
 * - Perform business logic
 * - Cache across screens
 * - Retry automatically
 *
 * @typeParam T - Item type being paginated
 *
 * @param fn - Async function that fetches a page
 * @param deps - Dependencies that reset pagination when changed
 * @param pageSize - Number of items per page (default: 20)
 *
 * @returns PaginatedAsyncState<T>
 */
export function usePaginatedAsyncRunner<T>(
  fn: (args: {
    page: number;
    pageSize: number;
  }) => Promise<{
    items: T[];
    hasMore: boolean;
  }>,
  deps: unknown[] = [],
  pageSize: number = 20
): PaginatedAsyncState<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setRefreshKey((k) => k + 1);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!hasMore && page !== 1) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fn({ page, pageSize });

        if (!cancelled) {
          setData((prev) =>
            page === 1 ? result.items : [...prev, ...result.items]
          );
          setHasMore(result.hasMore);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [...deps, page, refreshKey]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
````

---

## 🧩 How UI hooks should wrap this (example)

### `useRecentTransactions(itemId)`

```ts
export function useRecentTransactions(itemId: number) {
  const state = usePaginatedAsyncRunner(
    ({ page, pageSize }) =>
      transactionUiService.listTransactionsForItem(
        itemId,
        page,
        pageSize
      ),
    [itemId],
    10
  );

  return {
    transactions: state.data,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore: state.loadMore,
    refresh: state.refresh,
  };
}
```

---

## 📱 UI usage example (FlatList)

```tsx
<FlatList
  data={transactions}
  onEndReached={hasMore ? loadMore : undefined}
  onRefresh={refresh}
  refreshing={loading}
  keyExtractor={(item) => item.id.toString()}
  renderItem={...}
/>
```

---

## 🔒 Rules to enforce (important)

* ❌ No pagination logic in screens
* ❌ No manual page counters in UI
* ❌ No `.run()` calls
* ✅ Always use this hook for paginated lists

---

## 🧠 Mental model (consistent with your app)

| Hook                    | Purpose          |
| ----------------------- | ---------------- |
| useAsyncRunner          | Single-shot data |
| usePaginatedAsyncRunner | Growing lists    |

This keeps the UI layer **predictable, testable, and AI-safe**.

---

If you want next, I can:

* Add retry/backoff support
* Create a cursor-prompt for paginated screens
* Create a `useInfiniteScroll` alias
* Refactor an existing list screen to use this

Just say 👍
