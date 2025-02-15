import path from 'path';
import appRoot from 'app-root-path';

/**
 * 
 * @description: Common configuration.
 * 
 * @property {string} PREFIX - API prefix.
 * @property {string} COOKIE_TOKEN - Cookie name.
 * @property {string} COOKIE_EXPIRES_IN - Cookie expiration time.
 * @property {string} ACCESS_TOKEN_EXPIRES_IN - Access token expiration time.
 * @property {string} REFRESH_TOKEN_EXPIRES_IN - Refresh token expiration time.
 * @property {string} JWT_SECRET - JWT secret.
 * @property {string} PORT - Server port.
 * @property {string} UPLOADS_DIRECTORY - Uploads directory.
 * @property {string} DB_HOST - Database host.
 * @property {string} DB_USER - Database user.
 * @property {string} DB_PASSWORD - Database password.
 * @property {string} DB_NAME - Database name.
 * 
*/

export const commonConfig = {
  PREFIX: 'api',
  COOKIE_TOKEN: 'token',
  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN || 604800000, // 7 day
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '10m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
  PORT: process.env.PORT || 5555,
  UPLOADS_DIRECTORY: path.join(appRoot + '/uploads/'),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'test_db',
};
