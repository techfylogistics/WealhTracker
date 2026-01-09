let currentTraceId: string | null = null

export function startTrace(): string {
  currentTraceId = crypto.randomUUID()
  return currentTraceId
}

export function getTraceId(): string | null {
  return currentTraceId
}

export function clearTrace() {
  currentTraceId = null
}
