VALIDATIONS (UI vs Service — Clear Answer)
❗ Short answer

Validate in BOTH UI and services — but for different reasons.

✅ UI-level validation (UX concern)

📍 Location:

Forms

Zod schemas

UI hooks

Purpose:

Fast feedback

Disable submit

Friendly messages

Example:

const schema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
})


✔ UX
✔ Optional
✔ Can be bypassed

✅ Service-level validation (NON-NEGOTIABLE)

📍 Location:

src/domain/validators/


or

src/services/validators/


Purpose:

Data integrity

API safety

Defense-in-depth

Services must NEVER trust the UI.

✅ Best pattern (strongly recommended)

Use shared Zod schemas, but enforce them in services.

const CreateItemSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
})

async createItem(input: unknown) {
  const data = CreateItemSchema.parse(input)
  return this.repo.create(data)
}


✔ One source of truth
✔ UI can reuse schema
✔ Services stay protected

🔒 Rule to enforce (you should add)

All service entry points must validate inputs before repository access.