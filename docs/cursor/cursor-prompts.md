Use the project architecture defined in docs/architecture-folders.md.

Task:
Create a new UI screen.

Rules:
- UI code must live under app/screens
- Fetch data only via hooks in app/hooks
- Hooks must call UI services in app/ui-services
- UI services map domain/query models → view-models
- Do NOT import repositories, DB, or SQL
- Do NOT compute business logic in UI

Use the ViewModels from app/view-models.

-----------------------------
Create a UI hook following project standards.

Rules:
- Hook must live under app/hooks
- Use useAsyncRunner or usePaginatedAsyncRunner
- Hook must call a UI service, not domain services directly
- No business logic or calculations
- Return { data, loading, error, refresh }

Follow existing hooks for consistency.
-------------------------------------
Create a UI service.

Rules:
- File must live under app/ui-services
- UI service may import domain services and query-models
- UI service maps domain/query output → ViewModels
- No SQL, no repositories
- No calculations beyond formatting/mapping
- UI service must be instantiated in container.ts

Follow DashboardUiService patterns.
-----------------------
Create a domain service implementation.

Rules:
- Interface goes in src/domain/services
- Implementation goes in src/services/impl
- May use repository interfaces only
- Must not import UI code
- Must not import container.ts

Add JSDoc explaining business responsibility.
-------------------------------
Fix import errors while respecting architecture.

Rules:
- UI must not import from src/db or src/repositories/*
- Domain must not import from app/*
- Only container.ts may import both UI and domain
- Prefer domain interfaces over implementations

Explain the fix briefly.
