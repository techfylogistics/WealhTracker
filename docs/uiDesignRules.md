Folder	What lives here
src/hooks	Hooks that connect UI → services (use-cases)
components/ui	Pure presentational components (no hooks that fetch data)
components/features	Composed UI blocks (may receive data, but not fetch it)
All UI-related hooks that talk to services must live in src/hooks. 📌 If a hook imports container.ts, it belongs in src/hooks.

Feature hooks = capabilities 
    What they are

    Thin wrappers around one domain capability

    Usually map to one primary service

    Reusable across multiple screens
    Examples:
    useNetWorth

    useCategoryHierarchy

    useTransactions


    What they do

Fetch or mutate one type of data

Handle loading / error state

Expose a clean API to UI

What they must NOT do

❌ Orchestrate multiple services

❌ Contain business rules

❌ Know about screens


Screen hooks = use-cases
    Composition / Use-Case Hooks
    Example

    useDashboard

    usePortfolioOverview

    useSettingsSupport

    What they are

    Orchestrators

    Compose multiple feature hooks or services

    Represent a screen-level use-case

    What they do

    Combine data from multiple sources

    Control loading order / parallelism

    Shape data for that screen only. Shapes data for UI

    What they must NOT do

    ❌ Contain business logic

    ❌ Replace services

    ❌ Be reused everywhere
