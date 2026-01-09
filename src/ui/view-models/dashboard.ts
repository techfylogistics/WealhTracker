export type DashboardViewModel = {
  userName: string;

  netWorth: number;
  netWorthXirr: number | null;

  totalAssets: number;
  totalLiabilities: number;

  NetworthMoMChange: number | null;
//   liabilityMoMChangePct: number | null;

  donut: {
    assets: DonutSliceVM[];
    liabilities: DonutSliceVM[];
  };

  recentTransactions: RecentTransactionVM[];

  assetCategoryCards: CategoryCardVM[];
  liabilityCategoryCards: CategoryCardVM[];
};


// ### Supporting View Models


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
