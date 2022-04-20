declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
      DB_URI_TEST: string;
      CLIENT_ORIGIN: string;
      PORT: number;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRATION: string | number;
      JWT_REFRESH_EXPIRATION: string | number;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
