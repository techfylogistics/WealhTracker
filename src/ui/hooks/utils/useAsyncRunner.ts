import { useEffect, useState, useCallback } from "react";

/**
 * AsyncState
 *
 * Standard shape returned by async data hooks.
 * Used across the UI layer for predictable data loading.
 */
export type AsyncState<T> = {
  /** Resolved data from the async function, or null before completion */
  data: T | null;

  /** True while the async function is executing */
  loading: boolean;

  /** Error thrown by the async function, if any */
  error: Error | null;

  /**
   * Forces the async function to re-run.
   * Useful for pull-to-refresh or manual reloads.
   */
  refresh: () => void;
};

/**
 * useAsyncRunner
 *
 * A standardized hook for running async functions in a
 * declarative, React-idiomatic way.
 *
 * ---
 * ### Contract
 * - Executes the provided async function on mount
 * - Re-executes automatically when dependencies change
 * - Exposes loading, error, and refresh states
 * - Safe against state updates after unmount
 *
 * ---
 * ### Intended Usage
 * Used by **UI hooks only** (e.g., useDashboard, useCategoryDetail).
 * UI components and screens should never call this directly.
 *
 * ---
 * ### Example
 * ```ts
 * const state = useAsyncRunner(
 *   () => dashboardUiService.getDashboardVM(),
 *   []
 * );
 *
 * return {
 *   data: state.data,
 *   loading: state.loading,
 *   error: state.error,
 *   refresh: state.refresh,
 * };
 * ```
 *
 * ---
 * ### What this hook DOES
 * - Manages async lifecycle (loading/error/data)
 * - Supports pull-to-refresh via `refresh()`
 * - Cancels state updates on unmount
 *
 * ---
 * ### What this hook does NOT do
 * - Perform business logic
 * - Cache results beyond component lifecycle
 * - Retry automatically (by design)
 *
 * @typeParam T - The resolved data type returned by the async function
 *
 * @param fn - Async function to execute (must return a Promise)
 * @param deps - Dependency array controlling when the function re-runs
 *
 * @returns AsyncState<T>
 */
export function useAsyncRunner<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Triggers a manual re-execution of the async function.
   * Does not reset dependencies; instead increments an internal key.
   */
  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const result = await fn();
        if (!cancelled) {
          setData(result);
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
  }, [...deps, refreshKey]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
