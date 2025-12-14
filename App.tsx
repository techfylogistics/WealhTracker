import { Text } from 'react-native';
import { useAppBootstrap } from './app/hooks/useAppBootstrap';
import { SmokeTestScreen } from './app/screens/SmokeTestScreen';
import { useEffect } from 'react';
import { seedDatabaseIfNeeded } from './app/db/seed';
import { runMigrations } from '@/db/migrate';

export default function App() {

  const { isReady, error } = useAppBootstrap();

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!isReady) {
    return <Text>Loading...</Text>;
  }
  useEffect(() => {
    runMigrations();

    seedDatabaseIfNeeded();
  }, []);
  return <SmokeTestScreen />;

  // return <Text>App Ready</Text>;
}
