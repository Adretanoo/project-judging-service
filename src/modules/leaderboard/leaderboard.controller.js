'use strict';

const service = require('./leaderboard.service');

/**
 * HTTP layer for the leaderboard.
 * Returns the ranked list of projects by final weighted score.
 */
async function getLeaderboard(request, reply) {
  const leaderboard = await service.getLeaderboard();
  reply.send(leaderboard);
}

module.exports = { getLeaderboard };
