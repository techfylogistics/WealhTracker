Domain services know finance.
UI services know screens.
Hooks know React.

Hook → Domain Service → Repo (here hook handles react and maps to View Model)
 or
 Hook → UI Service → Domain Services → Repo (here hook only handles react)
UI Service maps domain → VM

For ← domain & app logic hooks
These hooks:

Talk to services / repositories / DB

Orchestrate business logic

Are NOT tied to UI components

Can be reused across many screens

Examples (belong here):

src/hooks/
 ├── useNetWorth.ts
 ├── useAssets.ts
 ├── useTransactions.ts
 ├── useXirr.ts
 ├── useBackup.ts


These hooks:

Call services/*

Aggregate data

Handle side effects

Are testable without UI

👉 These are application hooks, not UI hooks.

These are domain/data hooks


Should import from container.ts only

----
8️⃣ Final Rules (LOCK THESE IN)
✅ Hook rules

Hooks use useAsyncRunner

Hooks expose refresh

Hooks never compute

✅ UI rules

Screens call refresh

Components are stateless

UI never manages async lifecycle