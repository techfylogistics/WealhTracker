import { useState } from "react";
import { useAsyncRunner } from "@/ui/hooks/utils/useAsyncRunner";
import { assetCategoryDetailUiService } from "@/container";

export function useAssetCategoryDetail(categoryId: number) {
  const [range, setRange] =
    useState<'1M' | '3M' | '6M' | '1Y' | '5Y'>('6M');

  const state = useAsyncRunner(
    () =>
      assetCategoryDetailUiService.getAssetCategoryDetailVM(
        categoryId,
        range
      ),
    [categoryId, range]
  );

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    range,
    setRange,
    refresh: state.refresh,
  };
}
