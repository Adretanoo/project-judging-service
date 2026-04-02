'use strict';

const pool = require('../../config/db');

class ProjectRepository {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.description, p.team_name, p.author_id, p.created_at, u.full_name as author_name
       FROM projects p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.description, p.team_name, p.author_id, p.created_at, u.full_name as author_name
       FROM projects p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async create(projectData) {
    const { title, description, team_name, author_id } = projectData;
    const { rows } = await pool.query(
      `INSERT INTO projects (title, description, team_name, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, team_name, author_id]
    );
    return rows[0];
  }
}

module.exports = new ProjectRepository();
