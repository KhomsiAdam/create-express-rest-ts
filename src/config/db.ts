import 'dotenv/config';
import { connect as mongooseConnect } from 'mongoose';
import { log } from '@services/logger.service';

const DB_URI = process.env.DB_URI as string;

export const initializeDatabaseConnection = async (): Promise<void> => {
  try {
    const { connection } = await mongooseConnect(DB_URI);
    log.info(`Connected to database: ${connection.name}`);
    connection.on('error', (error) => {
      log.error(error);
    });
    connection.on('disconnected', () => {
      log.error('Database connection was lost.');
    });
    connection.on('reconnect', () => {
      log.info('Reconnecting...');
    });
    connection.on('connected', () => {
      log.info('Database connection was restored.');
    });
  } catch (error) {
    log.error(error);
  }
};
