import server from '@config/server';
import { initializeDatabaseConnection } from '@config/db';
import { log } from '@services/logger.service';

const port = process.env.PORT || 8080;

const initializeServer = async (): Promise<void> => {
  await initializeDatabaseConnection();
  server.listen(port, () => {
    log.info(`Server ready at: http://localhost:${port}/api`);
  });
};

initializeServer();
