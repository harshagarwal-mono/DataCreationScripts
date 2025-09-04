import mysql from 'mysql2/promise';
import env from '../config/env.js';

// Create connection pool
export const cdlDbPool = mysql.createPool({
  host: env.CDL_DATABASE_HOST,
  port: env.CDL_DATABASE_PORT,
  database: env.CDL_DATABASE_NAME,
  user: env.CDL_DATABASE_USERNAME,
  password: env.CDL_DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: env.PARALLEL_PROCESSING_UNITS * 2, // Double the parallel processing units for better performance
  queueLimit: 0,
});

export default cdlDbPool;
