'use strict';

const repo = require('./criteria.repository');

/**
 * Business logic for evaluation criteria.
 */

async function createCriteria(data) {
  if (data.weight <= 0) {
    const err = new Error('weight must be a positive number');
    err.statusCode = 400;
    throw err;
  }
  if (data.max_score <= 0) {
    const err = new Error('max_score must be a positive integer');
    err.statusCode = 400;
    throw err;
  }
  return repo.createCriteria(data);
}

async function getAllCriteria() {
  return repo.getAllCriteria();
}

module.exports = { createCriteria, getAllCriteria };
