import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { seedDatabaseIfNeeded } from './../db/seed';

import { initializeDatabase } from '@/db/schema';
import { snapshotRefreshService } from '@/core/container';

export function useAppBootstrap() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        // 🟢 Mobile platforms: real SQLite
        if (Platform.OS !== 'web') {
          await initializeDatabase();
          await seedDatabaseIfNeeded();
          // await snapshotRefreshService.refreshAll();
        }

        // 🌐 Web: skip DB + background computation
        // (UI can still render, services can be stubbed later)

        if (!cancelled) {
          setIsReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isReady,
    error
  };
}
