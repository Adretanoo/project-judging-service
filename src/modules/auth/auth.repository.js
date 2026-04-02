'use strict';

const pool = require('../../config/db');

async function createUser({ full_name, email, password_hash, role }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create user
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [full_name, email, password_hash, role]
    );
    const user = rows[0];

    // If role is judge, create corresponding judge persona
    if (role === 'judge') {
      await client.query(
        `INSERT INTO judges (user_id) VALUES ($1)`,
        [user.id]
      );
    }

    await client.query('COMMIT');
    return user;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

module.exports = { createUser, getUserByEmail };
