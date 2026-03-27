'use strict';

const pool = require('../../config/db');

/**
 * Inserts a new criterion and returns the created record.
 */
async function createCriteria({ name, weight, max_score }) {
  const { rows } = await pool.query(
    `INSERT INTO criteria (name, weight, max_score)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, weight, max_score]
  );
  return rows[0];
}

/**
 * Returns all criteria.
 */
async function getAllCriteria() {
  const { rows } = await pool.query(`SELECT * FROM criteria ORDER BY id`);
  return rows;
}

/**
 * Returns a single criterion by primary key, or null if not found.
 */
async function getCriteriaById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM criteria WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createCriteria, getAllCriteria, getCriteriaById };
