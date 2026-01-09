/* =========================================================
   Centralized Application Logger (Fintech-Safe)
   Logger decides where to log
   ========================================================= */

import { getTraceId } from './traceContext'
// import * as Sentry from 'sentry-expo'
import { loggingConfig } from '@/config/loggingConfig'
import { appendLogToFile } from './localFileLogger'

/* =========================================================
   Types
   ========================================================= */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type Allowlist = readonly string[]

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  traceId?: string | null
  context?: unknown
}

/* =========================================================
   Configuration
   ========================================================= */

const LOG_LEVEL: LogLevel = __DEV__ ? 'debug' : 'info'

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const MAX_LOG_DEPTH = 4
const MAX_ARRAY_LENGTH = 20
const MAX_STRING_LENGTH = 500

const SENSITIVE_KEYS = [
  'password',
  'pass',
  'pwd',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'pin',
  'otp',
]

/* =========================================================
   Helpers
   ========================================================= */

function shouldLog(level: LogLevel): boolean {
  return (
    LOG_LEVEL_PRIORITY[level] >=
    LOG_LEVEL_PRIORITY[LOG_LEVEL]
  )
}

function maskSensitive(key: string, value: unknown): unknown {
  if (
    SENSITIVE_KEYS.some(
      k => k.toLowerCase() === key.toLowerCase()
    )
  ) {
    return '***'
  }
  return value
}

function applyAllowlist(
  obj: Record<string, unknown>,
  allowlist?: Allowlist
): Record<string, unknown> {
  if (!allowlist) return obj

  const allowed: Record<string, unknown> = {}
  for (const key of allowlist) {
    if (key in obj) {
      allowed[key] = obj[key]
    }
  }
  return allowed
}

function safeSerialize(
  value: unknown,
  seen = new WeakSet<object>(),
  depth = 0,
  allowlist?: Allowlist
): unknown {
  try {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      }
    }

    if (
      value === null ||
      typeof value !== 'object'
    ) {
      if (
        typeof value === 'string' &&
        value.length > MAX_STRING_LENGTH
      ) {
        return value.slice(0, MAX_STRING_LENGTH) + '…'
      }
      return value
    }

    if (seen.has(value)) {
      return '[Circular]'
    }
    seen.add(value)

    if (depth > MAX_LOG_DEPTH) {
      return '[Truncated]'
    }

    if (Array.isArray(value)) {
      return value
        .slice(0, MAX_ARRAY_LENGTH)
        .map(v =>
          safeSerialize(v, seen, depth + 1)
        )
    }

    const source =
      allowlist
        ? applyAllowlist(value as Record<string, unknown>, allowlist)
        : (value as Record<string, unknown>)

    const result: Record<string, unknown> = {}

    for (const [key, val] of Object.entries(source)) {
      const masked = maskSensitive(key, val)
      result[key] =
        masked === '***'
          ? '***'
          : safeSerialize(masked, seen, depth + 1)
    }

    return result
  } catch {
    return '[Unserializable]'
  }
}
// function asExtras(value: unknown): Record<string, any> | undefined {
//   if (value && typeof value === 'object') {
//     return value as Record<string, any>
//   }
//   return undefined
// }

/* =========================================================
   Core Logger
   ========================================================= */

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  allowlist?: Allowlist
) {


  if (!shouldLog(level)) return



  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    traceId: getTraceId(),
    context: context
      ? safeSerialize(context, new WeakSet(), 0, allowlist)
      : undefined,
  }

  const output = JSON.stringify(entry)
  // ---- Console (optional)
  if (__DEV__) {
    console.log(output)
  }

  // // ---- Local file logging
  // if (loggingConfig.mode === 'local' || loggingConfig.mode === 'both') {
  //   appendLogToFile(output)
  // }
  switch (level) {
    case 'debug':
    case 'info':
      console.log(output)
      break
    case 'warn':
      console.warn(output)
      break
    case 'error':
      console.error(output)

      // ---- Sentry integration (errors only)

      break
  }

  // ---- Local file sink
  if (
    loggingConfig.mode === 'local' ||
    loggingConfig.mode === 'both'
  ) {
    appendLogToFile(output)
  }

  // ---- Remote sink (optional)
  if (
    loggingConfig.mode !== 'local' &&
    level === 'error'
  ) {
    // Sentry.Native.captureException(
    //   context?.error instanceof Error
    //     ? context.error
    //     : new Error(message),
    //   {
    //     extra: asExtras(entry.context),
    //     tags: { traceId: entry.traceId ?? 'none' },
    //   }
    // )
  }
}

/* =========================================================
   Public API
   ========================================================= */

export const logger = {
  debug(
    message: string,
    context?: Record<string, unknown>,
    allowlist?: Allowlist
  ) {
    log('debug', message, context, allowlist)
  },

  info(
    message: string,
    context?: Record<string, unknown>,
    allowlist?: Allowlist
  ) {
    log('info', message, context, allowlist)
  },

  warn(
    message: string,
    context?: Record<string, unknown>,
    allowlist?: Allowlist
  ) {
    log('warn', message, context, allowlist)
  },

  error(
    message: string,
    context?: Record<string, unknown>,
    allowlist?: Allowlist
  ) {
    log('error', message, context, allowlist)
  },
}
