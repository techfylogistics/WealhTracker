import { fileSystem } from '../platform-adapters/FileSystem'

const LOG_FILE = `${fileSystem.baseDir}app.log`

export async function appendLogToFile(
  line: string
): Promise<void> {
  try {
    if (!LOG_FILE) return

    let existing = ''

    if (await fileSystem.exists(LOG_FILE)) {
      existing = await fileSystem.read(LOG_FILE)
    }

    await fileSystem.write(
      LOG_FILE,
      existing + line + '\n'
    )
  } catch {
    // Logging must NEVER crash the app
  }
}

export function getLogFilePath(): string {
  return LOG_FILE
}
