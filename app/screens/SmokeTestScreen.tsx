import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';

import {
  categoryHierarchyService,
  financialSummaryService,
  netWorthService,
  snapshotRefreshService
} from '@/core/container';

export function SmokeTestScreen() {
  const [output, setOutput] = useState<string>('Running smoke tests...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function runTests() {
      try {
        console.log("in smoke test screen");
        const snapshotDate = new Date().toISOString().slice(0, 10);

        const lines: string[] = [];

        lines.push(`Platform: ${Platform.OS}`);

        // 1️⃣ Category tree
        const tree = await categoryHierarchyService.getCategoryTree();
        lines.push(`Category count: ${tree.length}`);

        // 2️⃣ Leaf categories
        const leaves = await categoryHierarchyService.getLeafCategoryIds();
        lines.push(`Leaf categories: ${leaves.length}`);

        // 3️⃣ Net worth, before that we need to compute summaries and agregates so calling snapshot service
        await snapshotRefreshService.refreshAll();

        const netWorth:any = await netWorthService.getLatest();
        lines.push(`Net worth value: ${netWorth.networth}`);
        const networkOnDate = await netWorthService.getOverallNetWorth(snapshotDate);
        lines.push(`Net worth value on today: ${networkOnDate.value}`);

        // 4️⃣ Per-category net worth
        const categoryNW = await netWorthService.getCategoryNetWorth(snapshotDate);
        lines.push(`Category net worth entries: ${categoryNW.length}`);
        lines.push(`Category net worth first category: ${categoryNW[0].categoryId}`);
        lines.push(`Category net worth first category value: ${categoryNW[0].value}`);

        // 5️⃣ Financial summary (safe even if empty)
        // const summary = await financialSummaryService.getOverallSummary();
        // lines.push(`Invested: ${summary.totalInvested}`);
        // lines.push(`Returns: ${summary.totalReturns}`);
        // lines.push(`Expenses: ${summary.totalExpenses}`);

        lines.push('Overall summary skipped (no items yet)');


        if (!cancelled) {
          setOutput(lines.join('\n'));
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
        }
      }
    }

    runTests();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Smoke test failed:</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smoke Test Screen</Text>
      <Text style={styles.output}>{output}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  output: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    lineHeight: 20
  },
  error: {
    color: 'red'
  }
});
