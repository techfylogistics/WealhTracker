import { useAsyncRunner } from "@/ui/hooks/utils/useAsyncRunner";
import { dashboardUiService } from "@/container";

export function useDashboard() {
  const state = useAsyncRunner(
    () => dashboardUiService.getDashboardVM(),
    []
  );

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh: state.refresh, // pull-to-refresh ready
  };
}
