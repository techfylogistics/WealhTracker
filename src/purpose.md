✅ Correct Dependency Visibility (This Is the Key)
Layer	May import interfaces	May import implementations
Domain models	✅	❌
Service interfaces	✅	❌
Service implementations	✅ (repos, domain)	❌ (other impls)
Repositories	✅ (domain)	❌
Hooks / UI	✅ (interfaces or instances)	❌
container.ts	❌ (not needed)	✅ YES

Implementations must “die” in the container.
They should not leak upward.

UI/hooks -> container->services->repository->db
------------------
Rules

Rule to follow:

Only pure, stateless helpers

No DB

No services

No business rules

If a util starts encoding business meaning → move to domain/.