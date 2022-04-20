import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  standardHeaders: false,
  legacyHeaders: false,
  message: 'You exceeded the allowed number of requests, please try again in an hour.',
});
