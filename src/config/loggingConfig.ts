export type LoggingMode = 'local' | 'remote' | 'both'

export const loggingConfig = {
  mode: __DEV__ ? 'local' : 'local', // 👈 default local-only
}
