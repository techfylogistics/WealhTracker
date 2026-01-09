models are imported directly into services and repos. no need for container or DI

Thing	Runtime state?	Lifecycle?	Belongs in container?
Domain models	❌ No	❌ No	❌ No
Repositories	✅ Yes	✅ Yes	✅ Yes
Services	✅ Yes	✅ Yes	✅ Yes
DB connections	✅ Yes	✅ Yes	✅ Yes

So:

If it doesn’t have lifecycle, it doesn’t belong in the container.

And this folder also contains service contracts - interfaces only and these interfaces should not import any other items other than models.
