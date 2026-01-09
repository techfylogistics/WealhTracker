import remoteConfig from '@react-native-firebase/remote-config'

export async function initRemoteConfig() {
  await remoteConfig().setDefaults({
    LOG_NET_WORTH: true,
    LOG_XIRR: false,
    LOG_SNAPSHOT_REFRESH: false,
  })

  await remoteConfig().fetchAndActivate()
}

export function getRemoteFlag(key: string): boolean {
  return remoteConfig().getBoolean(key)
}
