There are actually TWO different model types in your system
1️⃣ Query / Read Models (what services & repos use)

These represent:

aggregated data

reporting results

projections

snapshots

trends

They are:

✅ allowed in repositories

✅ allowed in services

❌ NOT UI-shaped

❌ NOT screen-specific

Examples (from your code):

NetWorthSnapshot

CategoryNetWorth

CategoryXIRR

FinancialSummary

NetWorthTrendPoint

These are backend-facing read models, not UI models.

2️⃣ UI ViewModels (what hooks create)

These represent:

chart-ready data

labeled values

formatted structures

UI composition needs

They are:

❌ NOT allowed in services

❌ NOT allowed in repositories

✅ created in hooks

✅ consumed by screens

Example:

{
  label: 'Equity',
  value: 123456,
  color: '#4CAF50'
}

🧠 Key Rule (Very Important)

Services may return read models
Hooks adapt read models into UI ViewModels