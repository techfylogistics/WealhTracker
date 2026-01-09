# WealthTracker Architecture

## 1) Architecture Overview

### 1.1 Layered Dependency Flow (contract)
**Rule:** Dependencies flow in one direction only.

`DB → Repositories → Domain Services → Container (DI) → UI Services → UI Hooks → UI Components → UI Screens`

### 1.2 Architecture Diagram (Mermaid)

> Paste this in any Markdown viewer that supports Mermaid (GitHub supports it).

```mermaid
flowchart TB
  subgraph UI["UI Layer (app/)"]
    Screens["Screens\n(Dashboard, Asset Detail, Category Detail, etc.)"]
    Components["UI Components\n(Reusable, presentational)"]
    Hooks["UI Hooks\n(useDashboard, useXirr, etc.)"]
    UiServices["UI Services\n(Map domain outputs → ViewModels)"]
    ViewModels["ViewModels\n(Screen contracts: DashboardVM, AssetDetailVM, ...)"]
  end

  subgraph DI["Composition Layer"]
    Container["Container / DI\n(singletons, wiring, config)"]
  end

  subgraph Domain["Domain Layer (src/)"]
    Services["Domain Services\n(Business logic, aggregates, semantics)"]
    Repos["Repository Interfaces\n(contracts)"]
    Models["Domain Models + Types\n(Item, Category, Transaction, ItemDocument, ...)"]
  end

  subgraph Infra["Infrastructure Layer (src/)"]
    RepoImpl["SQLite Repository Implementations\n(expo-sqlite SQL only)"]
    Db["SQLite DB Access\n(query/execute helpers)"]
    Schema["Schema + Seed\n(wealthtracker.sql)"]
    Caches["Caches / Snapshot Tables\n(networth snapshots, xirr_cache, etc.)"]
    Logging["Logging + Diagnostics\n(custom logger wrapper)"]
  end

  Screens --> Components
  Components --> Hooks
  Hooks --> UiServices
  UiServices --> ViewModels

  UiServices --> Container
  Hooks --> Container

  Container --> Services
  Services --> Repos
  Services --> Models

  Repos --> RepoImpl
  RepoImpl --> Db
  Db --> Schema
  Db --> Caches
  Services --> Logging
  RepoImpl --> Logging
DB → Repos → Services → Container → UI Services → Hooks → Components → Screens

container
   ↓
src/domain
   ↓
src/repositories
   ↓
src/db

container
   ↓
app/ui-services
   ↓
app/hooks
   ↓
app/components
   ↓
app/screens
