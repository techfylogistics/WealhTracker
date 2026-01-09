Folder Structure Guide
/src — Backend / Domain / Infrastructure

Purpose:
Contains all non-UI logic. This code must be:

UI-agnostic

Framework-agnostic

Testable in isolation

/src/domain

What goes here

Business concepts

Rules and invariants

Domain-level validation

Must NOT contain

SQLite

Expo / React imports

UI concerns

/src/domain/models

Core business entities.

Examples:

Item

Category

Transaction

ItemDocument

/src/domain/services

Service interfaces defining business capabilities.

Examples:

NetWorthService

XirrService

CategoryHierarchyService

/src/domain/repositories

Repository interfaces (contracts).

Examples:

ItemRepository

TransactionRepository

/src/query-models

Read-only data shapes:

Aggregates

Snapshots

Cached results

Used for dashboards, reports, trends.

/src/repositories-impl/*

Infrastructure implementations.

Examples:

SQLite repositories

In-memory repositories (tests)

Mock repositories

Rule:
UI and domain services must NEVER import from here directly.

/src/services/impl

Concrete implementations of domain services.

May import repository interfaces

May import infra repositories

Must not import UI code

/src/platform-adapters

Adapters to OS / device capabilities.

Examples:

File system

Device APIs

/src/container.ts

Composition Root

Wires repositories → services → UI services

Applies logging, decorators

Exports ready-to-use instances

Rule:
Only place allowed to “know everything”.

/app — UI Layer

Purpose:
Everything related to rendering, interaction, navigation.

/app/screens

Top-level screens.

Navigation

Composition

No business logic

/app/components

Reusable UI components.

Stateless where possible

Props only

/app/hooks

UI hooks.

Use useAsyncRunner

Call UI services

No calculations

/app/ui-services

Mapping layer.

Domain/query models → ViewModels

Formatting allowed

No business logic

/app/view-models

UI contracts.

One per screen (or major section)

What the UI expects, not how it’s computed

/app/theme

Design system.

Colors

Spacing

Typography

Tokens

🧠 Golden Rules (for team + AI)

UI never imports repositories or DB

Domain never imports UI

Container wires everything

Hooks are lifecycle only

Services are business logic only

ViewModels are UI truth

Final Assessment

Your structure is already at a senior / staff-engineer level.
Only minor naming clarifications are recommended, not a redesign.
--------------------------------------------------------------------


