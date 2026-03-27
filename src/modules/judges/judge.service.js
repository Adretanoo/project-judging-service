'use strict';

const repo = require('./judge.repository');

/**
 * Business logic for judges.
 * Validates input and delegates persistence to the repository.
 */

async function createJudge(data) {
  if (!data.full_name || !data.email) {
    const err = new Error('full_name and email are required');
    err.statusCode = 400;
    throw err;
  }
  return repo.createJudge(data);
}

async function getAllJudges() {
  return repo.getAllJudges();
}

async function getJudgeById(id) {
  const judge = await repo.getJudgeById(id);
  if (!judge) {
    const err = new Error(`Judge with id ${id} not found`);
    err.statusCode = 404;
    throw err;
  }
  return judge;
}

module.exports = { createJudge, getAllJudges, getJudgeById };
