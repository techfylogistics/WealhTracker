// Platform filesystem abstraction
// Expo FileSystem deprecations are intentionally isolated here

/* eslint-disable deprecation/deprecation */
import * as ExpoFileSystem from 'expo-file-system'
/* eslint-enable deprecation/deprecation */

const baseDir =
  (ExpoFileSystem as any).cacheDirectory ?? ''

export const fileSystem = {
  baseDir,

  async exists(path: string): Promise<boolean> {

    const info = await ExpoFileSystem.getInfoAsync(path)
    return info.exists
  },

  async read(path: string): Promise<string> {

    return ExpoFileSystem.readAsStringAsync(path)
  },

  async write(path: string, data: string): Promise<void> {
    await ExpoFileSystem.writeAsStringAsync(path, data)
  },
}
