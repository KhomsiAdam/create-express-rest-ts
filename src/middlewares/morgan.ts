import morgan from 'morgan';
import { log } from '@services/logger.service';

// Use custom Winston logger
const stream = {
  write: (message: string) => log.http(message.substring(0, message.lastIndexOf('\n'))),
};

// Skip all the Morgan http log if app is not running in development
const skip = (): boolean => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

// Build the morgan middleware
const morganMiddleware = morgan(
  // Define message format string, and stream
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

export default morganMiddleware;
