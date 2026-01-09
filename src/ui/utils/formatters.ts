export function formatCurrency(
  value: number,
  options?: {
    compact?: boolean
    currency?: "INR" | "USD"
  }
) {
  const { compact = true, currency = "INR" } = options ?? {}

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(value)
}
