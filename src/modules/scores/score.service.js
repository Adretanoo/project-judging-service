'use strict';

const repo        = require('./score.repository');
const judgeRepo   = require('../judges/judge.repository');
const projectRepo = require('../projects/project.repository');
const critRepo    = require('../criteria/criteria.repository');

/**
 * Business logic for scores.
 *
 * Before persisting a score we:
 *  1. Verify the judge, project, and criteria all exist.
 *  2. Verify score_value does not exceed the criterion's max_score.
 *  3. Delegate to the repository (which enforces the unique constraint).
 */
async function createScore(data) {
  const { judge_id, project_id, criteria_id, score_value } = data;

  // ── Existence checks ──────────────────────────────────────────────────────
  const judge = await judgeRepo.getJudgeById(judge_id);
  if (!judge) {
    const err = new Error(`Judge with id ${judge_id} not found`);
    err.statusCode = 404;
    throw err;
  }

  const project = await projectRepo.getProjectById(project_id);
  if (!project) {
    const err = new Error(`Project with id ${project_id} not found`);
    err.statusCode = 404;
    throw err;
  }

  const criteria = await critRepo.getCriteriaById(criteria_id);
  if (!criteria) {
    const err = new Error(`Criteria with id ${criteria_id} not found`);
    err.statusCode = 404;
    throw err;
  }

  // ── Range check ───────────────────────────────────────────────────────────
  if (score_value < 0 || score_value > criteria.max_score) {
    const err = new Error(
      `score_value must be between 0 and ${criteria.max_score} for criteria "${criteria.name}"`
    );
    err.statusCode = 400;
    throw err;
  }

  try {
    return await repo.createScore(data);
  } catch (dbErr) {
    // Unique constraint violation — judge already scored this criteria for the project
    if (dbErr.code === '23505') {
      const err = new Error(
        `Judge ${judge_id} has already scored criteria ${criteria_id} for project ${project_id}`
      );
      err.statusCode = 409;
      throw err;
    }
    throw dbErr;
  }
}

async function getScoresByProjectId(projectId) {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) {
    const err = new Error(`Project with id ${projectId} not found`);
    err.statusCode = 404;
    throw err;
  }
  return repo.getScoresByProjectId(projectId);
}

module.exports = { createScore, getScoresByProjectId };
