'use strict';

const controller = require('./leaderboard.controller');

async function leaderboardRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/',
    // Open route, anyone can view leaderboard
    schema: {
      tags: ['Leaderboard'],
      summary: 'Get the final project rankings',
      response: {
        200: { type: 'array', items: { $ref: 'LeaderboardEntry#' } },
      },
    },
    handler: controller.getLeaderboard,
  });
}

module.exports = leaderboardRoutes;
