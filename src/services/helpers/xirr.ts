type Cashflow = {
  date: string;   // YYYY-MM-DD
  amount: number; // negative = investment, positive = return
};

function daysBetween(d1: Date, d2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return (d2.getTime() - d1.getTime()) / msPerDay;
}

export function calculateXirr(
  cashflows: Cashflow[],
  maxIterations = 100,
  tolerance = 1e-6
): number | null {
  if (cashflows.length < 2) return null;

  const hasPositive = cashflows.some(c => c.amount > 0);
  const hasNegative = cashflows.some(c => c.amount < 0);
  if (!hasPositive || !hasNegative) return null;

  const sorted = [...cashflows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const t0 = new Date(sorted[0].date);

  const flows = sorted.map(c => ({
    amount: c.amount,
    time: daysBetween(t0, new Date(c.date)) / 365
  }));

  let rate = 0.1; // initial guess = 10%

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNpv = 0;

    for (const f of flows) {
      const denom = Math.pow(1 + rate, f.time);
      npv += f.amount / denom;
      dNpv -= (f.time * f.amount) / (denom * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) {
      return rate;
    }

    if (dNpv === 0) break;

    rate = rate - npv / dNpv;

    if (rate <= -0.9999) return null;
  }

  return null;
}
