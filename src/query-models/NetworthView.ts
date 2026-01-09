/* =========================================================
   NET WORTH (AGGREGATED VIEW)
   ========================================================= */

   export interface NetWorthSnapshot {
    totalAssets: number;
    totalLiabilities: number;
    networth: number;
  }
  
  export interface NetWorthTrendPoint {
    date: string;
    networth: number;
  }
  
  export interface CategoryNetWorth {
    categoryId: number;
    value: number;
  }
  export interface NetWorth {
    value: number;
  }
  export interface FinancialSummary {
    invested: number;
    returns: number;
    expenses: number;
    netGain: number;
  }
 