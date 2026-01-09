# Architecture Decision Records (ADR)

This document records the key architectural decisions made for WealthTracker,
along with the rationale behind each decision.

---

## ADR-001: Layered Clean Architecture

**Decision**
Adopt a strict layered architecture with one-directional dependencies:

DB → Repositories → Domain Services → Container → UI Services → UI Hooks → UI Components → UI Screens

**Reason**
- Prevents business logic leakage into UI
- Enables testing and refactoring
- Allows AI tools to reason safely

**Consequences**
- Slightly more boilerplate
- Strong long-term maintainability

---

## ADR-002: Repository Pattern with Interfaces in Domain

**Decision**
Place repository *interfaces* under `src/domain/repositories`,
and repository *implementations* under `src/repositories/impl`.

**Reason**
- Domain defines *what* it needs, not *how*
- Infrastructure remains swappable
- Clean separation of concerns

---

## ADR-003: SQLite with Snapshot & Cache Tables

**Decision**
Use SQLite as the primary store with snapshot/cache tables
(net worth snapshots, XIRR cache).

**Reason**
- Mobile users expect instant UI
- Heavy calculations moved off render path
- Background refresh strategy

---

## ADR-004: ViewModels & UI Services

**Decision**
Introduce UI Services to map domain/query models into screen-specific ViewModels.

**Reason**
- UI becomes dumb and predictable
- Prevents domain model leakage into UI
- Improves Cursor/Copilot code generation quality

---

## ADR-005: Avoid DOM Type Collisions

**Decision**
Never use reserved browser names like `Document` for domain models.
Use names like `ItemDocument`, `AssetDocument`.

**Reason**
- Prevents TypeScript DOM conflicts
- Avoids subtle type errors
- Improves IDE and AI tooling reliability

---

## ADR-006: DI Container for Wiring Only

**Decision**
Use a DI container strictly for object creation and wiring,
not for business logic.

**Reason**
- Centralized construction
- Easier testing and configuration
- No hidden dependencies

---

## ADR-007: UI Never Touches Repositories or DB

**Decision**
UI layers must never import repositories, SQLite helpers, or SQL.

**Reason**
- Enforces architectural boundaries
- Prevents logic duplication
- Keeps UI focused on presentation

---

## ADR-008: Cursor / AI as First-Class Developer

**Decision**
Design contracts, docs, and structure explicitly to guide AI tools.

**Reason**
- Faster UI development
- Fewer hallucinations
- Predictable outputs
