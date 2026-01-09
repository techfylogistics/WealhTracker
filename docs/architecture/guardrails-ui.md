# UI Development Guardrails

This document defines strict rules for UI developers and AI tools (Cursor, Copilot).

Breaking these rules introduces bugs, tech debt, and inconsistent behavior.

---

## 1️⃣ Allowed Imports (UI Layer)

UI code MAY import from:
- `app/viewmodels`
- `app/ui-services`
- `app/hooks`
- `src/domain/services`
- `src/domain/types`
- `src/query-models` (read-only)

UI code MUST NOT import from:
- `src/db`
- `src/repositories`
- `src/repositories/impl`
- SQLite helpers
- SQL files

---

## 2️⃣ UI Responsibilities

UI SHOULD:
- Render data
- Handle loading / empty / error states
- Navigate between screens
- Format values (currency, percent, dates)

UI MUST NOT:
- Compute net worth
- Compute XIRR
- Traverse category trees
- Infer transaction semantics
- Write SQL
- Call repositories directly

---

## 3️⃣ Hooks Rules

Hooks:
- Call UI services (preferred)
- Or call domain services via container
- Return `{ data, loading, error }`

Hooks MUST NOT:
- Contain business logic
- Mutate domain data directly
- Perform calculations

---

## 4️⃣ Components Rules

Components:
- Accept props only
- Be stateless where possible
- Never call services or hooks internally

---

## 5️⃣ Screens Rules

Screens:
- Compose components
- Use hooks
- Handle navigation and layout

Screens MUST NOT:
- Perform calculations
- Access repositories
- Manipulate domain models

---

## 6️⃣ Mutation Flow Rule

After ANY mutation:
- Call CRUD service
- Trigger SnapshotRefreshService (or relevant refresh)
- Re-render using cached/query services

---

## 7️⃣ Cursor / AI Prompt Template

Use this template when asking Cursor:

> Use the existing architecture.
> Do not add business logic.
> Do not access repositories or SQLite.
> Use ViewModels and hooks only.
> Follow docs/services.md and docs/screens/*.md strictly.

---

## 8️⃣ Code Review Checklist

- [ ] No SQL in UI
- [ ] No repository imports in UI
- [ ] No calculations in UI
- [ ] ViewModels used everywhere
- [ ] Hooks are thin
- [ ] Services boundaries respected

---

## 9️⃣ Golden Rule

> **If logic feels complex, it does not belong in UI.**
All async UI hooks MUST be built on useAsyncRunner.
No custom async logic is allowed in screens or components.

### Import Rules

UI Layer (app/*):
- ❌ MUST NOT import from src/db
- ❌ MUST NOT import from src/repositories/*
- ❌ MUST NOT import from src/services/impl
- ✅ MAY import from src/domain/services (interfaces)
- ✅ MAY import from src/query-models

Domain Layer (src/domain/*):
- ❌ MUST NOT import from app/*
- ❌ MUST NOT import from container.ts
- ❌ MUST NOT import infrastructure implementations

Infrastructure (src/repositories/*, src/services/impl):
- ❌ MUST NOT import from app/*
