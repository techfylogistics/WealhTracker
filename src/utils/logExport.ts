import * as Sharing from 'expo-sharing'
import { fileSystem } from '../platform-adapters/FileSystem'
import { getLogFilePath } from './localFileLogger'
import { getDeviceAndAppInfo } from './deviceInfo'

const EXPORT_FILE_NAME = 'wealthtracker-support-logs.txt'

export async function exportLogsForSupport(): Promise<void> {
  const logPath = getLogFilePath()

  const logsExist = await fileSystem.exists(logPath)
  if (!logsExist) {
    throw new Error('No logs available to export')
  }

  const logs = await fileSystem.read(logPath)
  const metadata = getDeviceAndAppInfo()

  const exportContent = `
==============================
 WealthTracker – Support Logs
==============================

--- App & Device Information ---
${JSON.stringify(metadata, null, 2)}

--- Application Logs ---
${logs}
`

  const exportPath =
    `${fileSystem.baseDir}${EXPORT_FILE_NAME}`

  await fileSystem.write(exportPath, exportContent)

  await Sharing.shareAsync(exportPath, {
    mimeType: 'text/plain',
    dialogTitle: 'Share logs with support',
  })
}
