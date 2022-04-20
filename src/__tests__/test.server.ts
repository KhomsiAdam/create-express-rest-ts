import 'dotenv/config';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import routes from '@config/routes';
import { morgan, notFound, errorHandler, limiter } from '@middlewares';

// Express Server
const server = express();

// Middlewares
server.use(morgan);
server.use(helmet());
server.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
server.use(compression());
server.use(cookieParser());
server.use('/api', limiter);
server.use(express.json({ limit: '10kb' }));
// server.use(express.urlencoded({ extended: false }));
server.use(mongoSanitize());
server.use(
  hpp({
    whitelist: ['filter'],
  }),
);

// Good. 👌
server.get('/api', (_req: Request, res: Response) => {
  res.send('Good. 👌');
});

// Api routes
server.use('/api', routes);

// Error Handling
server.use(notFound);
server.use(errorHandler);

export default server;
