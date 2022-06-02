import 'dotenv/config';
import { connect as mongooseConnect } from 'mongoose';
import { log } from '@services/logger.service';

const DB_URI = process.env.DB_URI as string;

export const initializeDatabaseConnection = async () => {
  try {
    if (!DB_URI) return log.warn('Cannot connect to database: Credentials not provided.');
    const { connection } = await mongooseConnect(DB_URI);
    log.info(`Connected to database: ${connection.name}`);
    connection.on('error', (error) => {
      log.error(error || 'Cannot connect to database: Unknown error.');
    });
    connection.on('disconnected', () => {
      log.warn('Database connection was lost.');
    });
    connection.on('connected', () => {
      log.info('Database connection was restored.');
    });
    return;
  } catch (error) {
    return log.error(error);
  }
};
