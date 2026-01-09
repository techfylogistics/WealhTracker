import { useState } from 'react'
import { exportLogsForSupport } from '@/utils/logExport'

export function useLogExport() {
  const [isExporting, setIsExporting] = useState(false)

  async function exportLogs() {
    setIsExporting(true)
    try {
      await exportLogsForSupport()
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportLogs,
    isExporting,
  }
}
