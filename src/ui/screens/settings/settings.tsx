import { useLogExport } from '@/ui/hooks/useLogExport'
import { Button, Alert } from 'react-native'

export function SupportScreen() {
  const { exportLogs, isExporting } = useLogExport()

  async function handleExport() {
    try {
      await exportLogs()
    } catch {
      Alert.alert(
        'Export failed',
        'Unable to export logs. Please try again later.'
      )
    }
  }

  return (
    <Button
      title={isExporting ? 'Preparing logs…' : 'Export logs'}
      onPress={handleExport}
      disabled={isExporting}
    />
  )
}
