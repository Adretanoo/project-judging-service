'use strict';

const pool = require('../../config/db');

/**
 * Inserts a new project and returns the created record.
 */
async function createProject({ title, description, team_name }) {
  const { rows } = await pool.query(
    `INSERT INTO projects (title, description, team_name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description || null, team_name]
  );
  return rows[0];
}

/**
 * Returns all projects ordered by creation date (newest first).
 */
async function getAllProjects() {
  const { rows } = await pool.query(
    `SELECT * FROM projects ORDER BY created_at DESC`
  );
  return rows;
}

/**
 * Returns a single project by primary key, or null if not found.
 */
async function getProjectById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM projects WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createProject, getAllProjects, getProjectById };
