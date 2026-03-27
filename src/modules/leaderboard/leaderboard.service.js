'use strict';

const pool = require('../../config/db');

/**
 * Leaderboard query.
 *
 * Formula: final_score = SUM(score_value * weight)
 *
 * Groups all scores by project, multiplies each score_value by its
 * criterion's weight, sums the products, and returns projects ranked
 * highest-to-lowest.
 */
async function getLeaderboard() {
  const { rows } = await pool.query(`
    SELECT
      ROW_NUMBER() OVER (ORDER BY SUM(s.score_value * c.weight) DESC) AS rank,
      p.id          AS project_id,
      p.title,
      p.team_name,
      ROUND(SUM(s.score_value * c.weight)::numeric, 4) AS final_score
    FROM scores s
    JOIN projects  p ON p.id = s.project_id
    JOIN criteria  c ON c.id = s.criteria_id
    GROUP BY p.id, p.title, p.team_name
    ORDER BY final_score DESC
  `);
  return rows;
}

module.exports = { getLeaderboard };
