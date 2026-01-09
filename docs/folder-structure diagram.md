# One-Page Architecture Map (Folders → Layers)

This diagram maps the physical folder structure to architectural layers.
Use this as a quick reference for developers and AI tools.

---

## Layered View (Top → Bottom)

┌──────────────────────────────────────────────┐
│ UI Screens                                   │
│ app/screens                                  │
├──────────────────────────────────────────────┤
│ UI Components                                │
│ app/components                               │
├──────────────────────────────────────────────┤
│ UI Hooks (lifecycle, async state)             │
│ app/hooks                                    │
├──────────────────────────────────────────────┤
│ UI Services (mapping → ViewModels)            │
│ app/ui-services                              │
├──────────────────────────────────────────────┤
│ View Models (screen contracts)                │
│ app/view-models                              │
├──────────────────────────────────────────────┤
│ ───────── Composition Root ─────────          │
│ container.ts                                 │
├──────────────────────────────────────────────┤
│ Domain Services (business logic)               │
│ src/domain/services                           │
├──────────────────────────────────────────────┤
│ Domain Repository Interfaces                  │
│ src/domain/repositories                      │
├──────────────────────────────────────────────┤
│ Domain Models & Validators                    │
│ src/domain/models                             │
│ src/domain/validators                         │
├──────────────────────────────────────────────┤
│ Query Models (read-only aggregates)            │
│ src/query-models                              │
├──────────────────────────────────────────────┤
│ Infrastructure Implementations                │
│ src/repositories-impl/* (sqlite, memory, mock)     │
│ src/services/impl                             │
├──────────────────────────────────────────────┤
│ Platform / OS Adapters                        │
│ src/platform-adapters                                  │
├──────────────────────────────────────────────┤
│ Persistence / DB                              │
│ src/db                                       │
└──────────────────────────────────────────────┘

---

## Directional Dependency Rule

Dependencies are allowed **only downward**:

UI → Container → Domain → Infrastructure → DB

❌ No upward imports  
❌ No sideways leaks  

---

## Mental Model

- **Domain** = what the business *means*
- **Infrastructure** = how data is stored / fetched
- **UI** = how information is shown
- **Container** = glue that wires everything together

If a file does not clearly belong to one of these,
it is probably in the wrong folder.
