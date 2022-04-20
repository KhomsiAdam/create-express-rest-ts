import 'dotenv/config';
import mongoose from 'mongoose';
import { log } from '@services/logger.service';

const DB_URI = process.env.DB_URI as string;

export const initializeDatabaseConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    log.debug('Connected to database.');
    mongoose.connection.on('error', (error) => {
      log.error(error);
    });
    mongoose.connection.on('disconnected', () => {
      log.error('Database connection was lost.');
    });
    mongoose.connection.on('reconnect', () => {
      log.debug('Reconnecting...');
    });
    mongoose.connection.on('connected', () => {
      log.debug('Database connection was restored.');
    });
  } catch (error) {
    log.error(error);
  }
};
