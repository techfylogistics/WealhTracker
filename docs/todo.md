# WealthTracker – Engineering TODO

This TODO tracks architectural, infrastructure, UI, and feature work.
All items align with Cursor rules and Clean Architecture principles.

---

## ✅ Phase 1: Core Infrastructure (FOUNDATION)

### Architecture & Structure
- [x] Define clean architecture layers (UI → container → services → repositories → db)
- [x] Establish `src/container.ts` as the single composition root
- [x] Enforce dependency direction vs runtime flow rules
- [x] Separate `app/` (routes/screens) from `src/` (business logic)
- [x] Finalize folder structure for domain, services, repositories, utils
- [x] Lock architecture via `global-architecture.mdc`

### Logging (Finalized)
- [x] Design AOP-style service logging (no logs in services)
- [x] Implement `loggerProxy` applied only in `container.ts`
- [x] Centralize logging in `logger.ts`
- [x] Support local file logging
- [x] Isolate Expo FileSystem behind `src/platform/fileSystem.ts`
- [x] Prevent Expo FS usage outside platform abstraction
- [x] Add masking, allowlists, log size limits
- [x] Support trace / correlation IDs
- [x] Optional remote logging (Sentry) via logger only
- [x] User-triggered log export only (no auto upload)
- [x] Log export includes app + device metadata
- [x] No PII or DB files in exported logs
- [x] Finalize logging Cursor rules (`logging.mdc`)
- [ ] Add log rotation
- [ ] Add encrypted log export (optional)

### Tooling & Process
- [x] Align Cursor rules with final architecture (no drift)
- [x] Add rules for forbidden imports (FS, logging, container misuse)
- [x] Establish docs-based TODO tracking (`docs/todo.md`)

---

## ⏭ Phase 2: UI & Theming (NEXT)
### Design Hooks
    review an existing hook and classify it

    generate hook templates

    add lint rules to enforce this

    help decide when to reuse vs compose

    Find out hooks required for all screens/use cases
### View Models
      Desing views modles
      Design UI services to map hooks/query-model/domain models to view models
  
  1️⃣ I can design DashboardService → DashboardVM fully
  2️⃣ I can map each service → which VM it feeds
  3️⃣ I can help you create Cursor prompts using these VMs
  How to use local storage to cache instead of calling services every time? VMs can be cashed right?
### Map hooks to services
    Create mapping of hooks to services
    Create mappings of screens to hooks
### Tailwind / NativeWind
- [ ] Install and configure NativeWind
- [ ] Add Tailwind config (`tailwind.config.js`)
- [ ] Define global design tokens (colors, spacing, typography)
- [ ] Setup theme variables (light / dark / branded themes)
- [ ] Lock theming rules in `theming.mdc`

### UI Architecture
- [ ] Define Atomic Design structure:
  - `components/ui` (atoms)
  - `components/features` (composed blocks)
- [ ] Create core UI primitives:
  - [ ] Button
  - [ ] Text
  - [ ] Card
  - [ ] Input
  - [ ] EmptyState
- [ ] Ensure all UI uses NativeWind classes only
- [ ] Lock UI rules in `ui-standards.mdc`

### Navigation
- [ ] Finalize Expo Router structure
- [ ] Add root `_layout.tsx`
- [ ] Setup Settings / Support screen routing
- [ ] Ensure App.tsx only boots providers

---

## ⏭ Phase 3: Core App Features

### Settings & Support
- [x] Create `useLogExport` hook
- [x] Add Support / Export Logs screen
- [ ] Add confirmation dialog before export
- [ ] Add success feedback (toast/snackbar)
- [ ] Add optional “Include device info” toggle
- [ ] Add support email prefill with exported logs

### Data & Performance
- [ ] Add in-memory caching strategy (read-heavy data)
- [ ] Define cache invalidation rules
- [ ] Align caching with repositories/services (not UI)

### Validation
- [ ] Decide validation split (UI vs service layer)
- [ ] Add Zod schemas for service inputs
- [ ] Lock validation rules in `services-and-data.mdc`

---

## ⏭ Phase 4: Quality & Hardening

### Error Handling
- [ ] Global ErrorBoundary
- [ ] User-friendly error states
- [ ] Consistent error mapping (DB → domain → UI)

### Performance
- [ ] FlashList for large lists
- [ ] Memoize heavy components
- [ ] Avoid unnecessary re-renders
- [ ] Lock performance rules in `performance-and-quality.mdc`

### Optional Enhancements
- [ ] Log rotation (max file size)
- [ ] Encrypted log export
- [ ] ZIP export for support bundles
- [ ] Background-safe log flushing

---

## 📌 Rules Alignment Checklist (Cursor)

- [x] Architecture rules enforced
- [x] Logging rules finalized
- [ ] UI standards rules
- [ ] Theming rules
- [ ] Performance rules
- [ ] Validation rules

---

_Last updated: keep this file as the single source of truth for technical progress._
