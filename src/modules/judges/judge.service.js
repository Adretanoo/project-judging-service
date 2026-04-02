'use strict';

const repo = require('./judge.repository');
const authRepo = require('../auth/auth.repository');
const bcrypt = require('bcryptjs');

class JudgeService {
  async getJudges() {
    return repo.findAll();
  }

  async getJudge(id) {
    const judge = await repo.findById(id);
    if (!judge) {
      const err = new Error('Judge not found');
      err.statusCode = 404;
      throw err;
    }
    return judge;
  }

  async createJudge(data) {
    const { full_name, email } = data;
    
    // Check if user exists
    const existing = await authRepo.getUserByEmail(email);
    if (existing) {
      const err = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    // Assign default password 'judge123'
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('judge123', salt);

    // Creates user and judge persona automatically
    await authRepo.createUser({ full_name, email, password_hash, role: 'judge' });

    // Fetch the newly created judge to return it in the format the frontend expects
    const { rows } = await require('../../config/db').query(
      `SELECT j.id, u.full_name, u.email, j.created_at 
       FROM judges j 
       JOIN users u ON j.user_id = u.id 
       WHERE u.email = $1`, [email]
    );

    return rows[0];
  }
}

module.exports = new JudgeService();
