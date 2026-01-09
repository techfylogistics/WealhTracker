import { logger } from '@/utils/logger'
// Proxy decides what to log

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type Allowlist = readonly string[]

interface LoggerProxyOptions {
  className: string
  argsAllowlist?: Record<string, Allowlist>
  resultAllowlist?: Record<string, Allowlist>
  logLevel?: LogLevel
  enabled?: () => boolean   // 🔑 runtime-evaluated
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

function shouldLog(
  eventLevel: LogLevel,
  serviceLevel?: LogLevel
) {
  if (!serviceLevel) return true
  return (
    LOG_LEVEL_PRIORITY[eventLevel] >=
    LOG_LEVEL_PRIORITY[serviceLevel]
  )
}

export function withLogging<T extends object>(
  instance: T,
  options: LoggerProxyOptions
): T {
  const {
    className,
    argsAllowlist,
    resultAllowlist,
    logLevel,
    enabled,
  } = options

  return new Proxy(instance, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver)
      if (typeof original !== 'function') return original

      return async (...args: unknown[]) => {
        const methodName = String(prop)

        if (enabled && !enabled()) {
          return original.apply(target, args)
        }

        if (shouldLog('debug', logLevel)) {
          logger.debug(
            `[${className}.${methodName}] → enter`,
            { args },
            argsAllowlist?.[methodName]
          )
        }

        try {
          const result = await original.apply(target, args)

          if (shouldLog('debug', logLevel)) {
            logger.debug(
              `[${className}.${methodName}] ← exit`,
              { result },
              resultAllowlist?.[methodName]
            )
          }

          return result
        } catch (error) {
          logger.error(
            `[${className}.${methodName}] ✖ error`,
            { error }
          )
          throw error
        }
      }
    },
  })
}
