import { getRemoteFlag } from './remoteConfig'

export const featureFlags = {
  LOG_NET_WORTH: () => getRemoteFlag('LOG_NET_WORTH'),
  LOG_XIRR: () => getRemoteFlag('LOG_XIRR'),
  LOG_SNAPSHOT_REFRESH: () => getRemoteFlag('LOG_SNAPSHOT_REFRESH'),
}
