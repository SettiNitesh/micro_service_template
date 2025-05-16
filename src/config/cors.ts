import { FastifyCorsOptions } from '@fastify/cors';

// Define the callback type according to the package's expectations
type OriginCallback = (err: Error | null, allow: boolean) => void;

// Use the FastifyCorsOptions type
export const corsOptions: FastifyCorsOptions = {
  origin: (origin: string | undefined, callback: OriginCallback) => {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) {
      return callback(null, true);
    }
    // Allow specific origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:4444'];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'), false);
  }
};
