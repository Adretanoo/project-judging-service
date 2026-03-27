'use strict';

const { Pool } = require('pg');

/**
 * Singleton PostgreSQL connection pool.
 * All modules import this pool and call pool.query() directly.
 */
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME     || 'judging_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Keep up to 10 idle connections in the pool
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verify connectivity on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌  Unable to connect to PostgreSQL:', err.message);
  } else {
    console.log('✅  Connected to PostgreSQL');
    release();
  }
});

module.exports = pool;
