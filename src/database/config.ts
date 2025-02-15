import mysql, { Pool } from 'mysql2/promise';
import { commonConfig } from '../config/env';

/**
 * Create a MySQL connection pool.
 * @type {Pool}
 */

const pool: Pool = mysql.createPool({
  host: commonConfig.DB_HOST,
  user: commonConfig.DB_USER,
  password: commonConfig.DB_PASSWORD,
  database: commonConfig.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
