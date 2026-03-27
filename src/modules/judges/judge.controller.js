'use strict';

const service = require('./judge.service');

/**
 * HTTP layer for judges.
 * Controllers extract/validate request data and return serialized responses.
 */

async function createJudge(request, reply) {
  const judge = await service.createJudge(request.body);
  reply.status(201).send(judge);
}

async function getAllJudges(request, reply) {
  const judges = await service.getAllJudges();
  reply.send(judges);
}

async function getJudgeById(request, reply) {
  const judge = await service.getJudgeById(parseInt(request.params.id, 10));
  reply.send(judge);
}

module.exports = { createJudge, getAllJudges, getJudgeById };
