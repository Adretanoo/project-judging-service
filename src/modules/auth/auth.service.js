'use strict';

const repo = require('./auth.repository');
const bcrypt = require('bcryptjs');

async function register(data) {
  const { email, password, full_name, role } = data;
  
  const existing = await repo.getUserByEmail(email);
  if (existing) {
    const err = new Error('User with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  return repo.createUser({ full_name, email, password_hash, role });
}

async function login(data) {
  const { email, password } = data;
  const user = await repo.getUserByEmail(email);
  
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  return { id: user.id, email: user.email, role: user.role, full_name: user.full_name };
}

module.exports = { register, login };
