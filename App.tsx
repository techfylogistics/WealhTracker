import { useEffect } from 'react';
import { Text } from 'react-native';

// import { migrations } from './app/db/migrations';
import { seedDatabaseIfNeeded } from './app/db/seed';
import { useAppBootstrap } from './app/hooks/useAppBootstrap';
import {SmokeTestScreen} from './app/screens/SmokeTestScreen';

export default function App() {
  const { isReady, error } = useAppBootstrap();

  useEffect(() => {
    (async () => {
      try {
        // await migrations();          // 1️⃣ schema
        // await seedDatabaseIfNeeded();   // 2️⃣ seed
        // later:
        // await recomputeItemCurrentValues();
        // await computeNetworthSnapshot();
      } catch (e) {
        console.error('DB init failed', e);
      }
    })();
  }, []); // ✅ runs once only

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!isReady) {
    return <Text>Loading...</Text>;
  }

  return <SmokeTestScreen />;
}
