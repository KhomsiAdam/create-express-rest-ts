import 'dotenv/config';
import { initializeExpress } from '@config/server';
import { initializeDatabaseConnection } from '@config/db';

const initializeServer = async (): Promise<void> => {
  await initializeDatabaseConnection();
  initializeExpress();
};

initializeServer();
