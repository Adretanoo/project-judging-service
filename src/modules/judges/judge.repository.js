'use strict';

const pool = require('../../config/db');

class JudgeRepository {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT j.id, u.full_name, u.email, j.created_at 
       FROM judges j 
       JOIN users u ON j.user_id = u.id
       ORDER BY j.created_at DESC`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT j.id, u.full_name, u.email, j.created_at 
       FROM judges j 
       JOIN users u ON j.user_id = u.id
       WHERE j.id = $1`,
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = new JudgeRepository();
