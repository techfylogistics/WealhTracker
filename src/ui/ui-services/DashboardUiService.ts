import type {
    NetWorthService,
    XirrQueryService,
    CategoryHierarchyService,
    TransactionService,
} from "@/src/domain/services/services-index";

import {
    DashboardViewModel,
    DonutSliceVM,
    CategoryCardVM,
    RecentTransactionVM,
} from "@/src/us/view-models/dashboard";

// import { formatCurrency } from "@/src/us/utils/formatters";

export class DashboardUiServiceImpl {
    constructor(
        private readonly netWorthService: NetWorthService,
        private readonly xirrQueryService: XirrQueryService,
        private readonly categoryHierarchyService: CategoryHierarchyService,
        private readonly transactionService: TransactionService
    ) { }

    async getDashboardVM(): Promise<DashboardViewModel> {
        const [
            latestNetWorth,
            moMTrend,
            categoryTree,
            categoryNetWorth,
            overallXirr,
            recentTxns,
        ] = await Promise.all([
            this.netWorthService.getLatest(),
            this.netWorthService.getMoMTrend(),
            this.categoryHierarchyService.getCategoryTree(),
            this.netWorthService.getLatestCategoryNetworth(),// .getCategoryNetWorthSnapshot(
            //     new Date().toISOString().slice(0, 10)
            // ),
            this.xirrQueryService.getXirr("OVERALL"),
            this.transactionService.txnListLatest5(),
        ]);

        const assetCategories = categoryTree.filter(
            (c) => c.natureCode === "ASSET"
        );
        const liabilityCategories = categoryTree.filter(
            (c) => c.natureCode === "LIABILITY"
        );

        const assetSlices: DonutSliceVM[] = [];
        const liabilitySlices: DonutSliceVM[] = [];

        const assetCards: CategoryCardVM[] = [];
        const liabilityCards: CategoryCardVM[] = [];

        for (const c of assetCategories) {
            const value =
                categoryNetWorth.find((n) => n.categoryId === c.id)?.value ?? 0;

            const xirr = await this.xirrQueryService.getXirr("CATEGORY", c.id);

            assetSlices.push({
                categoryId: c.id,
                categoryName: c.name,
                value,
                color: `cat-${c.id}`,
            });

            assetCards.push({
                categoryId: c.id,
                categoryName: c.name,
                value,
                xirr,
                color: `cat-${c.id}`,
            });
        }

        for (const c of liabilityCategories) {
            const value =
                categoryNetWorth.find((n) => n.categoryId === c.id)?.value ?? 0;

            const xirr = await this.xirrQueryService.getXirr("CATEGORY", c.id);

            liabilitySlices.push({
                categoryId: c.id,
                categoryName: c.name,
                value,
                color: `cat-${c.id}`,
            });

            liabilityCards.push({
                categoryId: c.id,
                categoryName: c.name,
                value,
                xirr,
                color: `cat-${c.id}`,
            });
        }

        const recentTransactions: RecentTransactionVM[] = recentTxns.map((t) => ({
            transactionId: t.id,
            title: t.notes ?? t.txnTypeCode,
            amount: t.amount,
            date: t.txnDate,
        }));

        const latestMoM = moMTrend.at(-1);

        return {
            userName: "User",

            netWorth: latestNetWorth.networth,
            netWorthXirr: overallXirr,

            //   totalAssets: assetSlices.reduce((s, a) => s + a.value, 0),
            //   totalLiabilities: liabilitySlices.reduce((s, l) => s + l.value, 0),
            totalAssets: latestNetWorth.totalAssets,
            totalLiabilities: latestNetWorth.totalLiabilities,

            NetworthMoMChange: latestMoM?.value ?? null,
            // liabilityMoMChangePct: latestMoM?.liabilitiesChangePct ?? null,

            donut: {
                assets: assetSlices,
                liabilities: liabilitySlices,
            },

            recentTransactions,

            assetCategoryCards: assetCards,
            liabilityCategoryCards: liabilityCards,
        };
    }
}
