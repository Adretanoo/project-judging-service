'use strict';

const pool = require('../../config/db');

/**
 * Inserts a new judge and returns the created record.
 */
async function createJudge({ full_name, email }) {
  const { rows } = await pool.query(
    `INSERT INTO judges (full_name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [full_name, email]
  );
  return rows[0];
}

/**
 * Returns all judges ordered by creation date (newest first).
 */
async function getAllJudges() {
  const { rows } = await pool.query(
    `SELECT * FROM judges ORDER BY created_at DESC`
  );
  return rows;
}

/**
 * Returns a single judge by primary key, or null if not found.
 */
async function getJudgeById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM judges WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createJudge, getAllJudges, getJudgeById };
