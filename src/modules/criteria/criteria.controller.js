'use strict';

const service = require('./criteria.service');

/**
 * HTTP layer for criteria.
 */

async function createCriteria(request, reply) {
  const criteria = await service.createCriteria(request.body);
  reply.status(201).send(criteria);
}

async function getAllCriteria(request, reply) {
  const criteria = await service.getAllCriteria();
  reply.send(criteria);
}

async function getCriteriaById(request, reply) {
  const criteria = await service.getCriteriaById(request.params.id);
  reply.send(criteria);
}

module.exports = { createCriteria, getAllCriteria, getCriteriaById };
