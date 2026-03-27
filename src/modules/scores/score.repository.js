'use strict';

const pool = require('../../config/db');

/**
 * Inserts a new score.
 *
 * Enforces the UNIQUE(judge_id, project_id, criteria_id) constraint —
 * the DB will throw a unique-violation error on duplicate, which the
 * service layer converts into a 409.
 */
async function createScore({ judge_id, project_id, criteria_id, score_value, comment }) {
  const { rows } = await pool.query(
    `INSERT INTO scores (judge_id, project_id, criteria_id, score_value, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [judge_id, project_id, criteria_id, score_value, comment || null]
  );
  return rows[0];
}

/**
 * Returns all scores for the given project, joined with judge and criteria info.
 */
async function getScoresByProjectId(projectId) {
  const { rows } = await pool.query(
    `SELECT
       s.id,
       s.score_value,
       s.comment,
       j.id         AS judge_id,
       j.full_name  AS judge_name,
       c.id         AS criteria_id,
       c.name       AS criteria_name,
       c.weight     AS criteria_weight,
       c.max_score  AS criteria_max_score
     FROM scores s
     JOIN judges   j ON j.id = s.judge_id
     JOIN criteria c ON c.id = s.criteria_id
     WHERE s.project_id = $1
     ORDER BY c.id, j.id`,
    [projectId]
  );
  return rows;
}

module.exports = { createScore, getScoresByProjectId };
