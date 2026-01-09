UI ViewModels (what hooks create)

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

What is a View Model (in your project)

In your app:

Services → return domain data / aggregates

View Models → shape that data exactly for a screen

UI → renders VMs, no logic

A View Model is screen-specific, immutable, and UI-friendly

❌ No SQL
❌ No business logic
❌ No repositories

What is a View Model (in your project)

In your app:

Services → return domain data / aggregates

View Models → shape that data exactly for a screen

UI → renders VMs, no logic

A View Model is screen-specific, immutable, and UI-friendly

❌ No SQL
❌ No business logic
❌ No repositories

UI services create view models from hooks.
Scneens use view models as is - unmutable - read only

----------------------
Why props matter in your architecture

In your app:

ViewModels are passed via props

Hooks return data

UI components consume props

No component fetches data itself

Example flow:

Hook → returns VM
Parent Screen → passes VM as props
Child Component → renders VM


This keeps UI:

predictable

testable

dumb (good thing)

--------------------
we can use hooks also to map domain /query model to view- model.

