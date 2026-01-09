import * as Device from 'expo-device'
import * as Application from 'expo-application'
import { Platform } from 'react-native'

export function getDeviceAndAppInfo() {
  return {
    app: {
      name: Application.applicationName,
      version: Application.nativeApplicationVersion,
      build: Application.nativeBuildVersion,
      environment: __DEV__ ? 'development' : 'production',
    },
    device: {
      platform: Platform.OS,
      osVersion: Device.osVersion,
      model: Device.modelName,
      manufacturer: Device.manufacturer,
      isPhysicalDevice: Device.isDevice,
    },
    timestamp: new Date().toISOString(),
  }
}
