'use strict';

const service = require('./score.service');

/**
 * HTTP layer for scores.
 */

async function createScore(request, reply) {
  const score = await service.createScore(request.body);
  reply.status(201).send(score);
}

async function getScoresByProject(request, reply) {
  const scores = await service.getScoresByProjectId(parseInt(request.params.id, 10));
  reply.send(scores);
}

module.exports = { createScore, getScoresByProject };
