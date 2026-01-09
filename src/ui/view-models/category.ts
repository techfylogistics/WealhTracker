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

