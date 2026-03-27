'use strict';

const controller = require('./leaderboard.controller');

/**
 * Fastify route definitions for the /leaderboard prefix.
 */
async function leaderboardRoutes(fastify) {
  // GET /leaderboard — Ranked project results
  fastify.route({
    method:  'GET',
    url:     '/',
    schema: {
      tags:        ['Leaderboard'],
      summary:     'Get the project leaderboard',
      description: `Returns all projects ranked by their final weighted score.
**Formula:** \`final_score = SUM(score_value × weight)\`

Projects with no scores are excluded. Results are ordered highest-to-lowest.`,
      response: {
        200: {
          type: 'array',
          items: { $ref: 'LeaderboardEntry#' },
        },
      },
    },
    handler: controller.getLeaderboard,
  });
}

module.exports = leaderboardRoutes;
