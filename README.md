# WealhTracker

## Prerequisites
- Node.js 20.x
- Expo 54.x
- Java 17.x
- Android SDK 36+
- npm 10.5.x

## Installation
1. Open a terminal and go to the project directory.
2. Install dependencies:
```bash
npm install
```

## Verify environment
- Run the Expo doctor:
```bash
npx expo-doctor
```
Expected output: "No issues detected" (if your environment is correct).

- Check Expo package status:
```bash
npx expo install --check
```
Expected output: "All dependencies are up to date".

## Expo commands
- Install a package with Expo (recommended for Expo-managed projects):
```bash
npx expo install <package-name>
```

- Start the app:
```bash
npx expo start
```

- Start the app and clear the cache:
```bash
npx expo start -c
```

After starting Expo:
- You can scan the QR code with the Expo app on your mobile device (ensure USB debugging and a USB connection if using a connected device), or
- Run the app in a web/desktop browser by pressing `w` in the Expo CLI terminal.

## Notes
- Make sure your device and development machine are on the same network if using the LAN/QR workflow.
- If you run into issues, re-run `npx expo-doctor` to get diagnostics and suggestions.
