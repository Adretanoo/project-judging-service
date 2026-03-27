'use strict';

const controller = require('./criteria.controller');

/**
 * Fastify route definitions for the /criteria prefix.
 */
async function criteriaRoutes(fastify) {
  // POST /criteria — Create a new criterion
  fastify.route({
    method:  'POST',
    url:     '/',
    schema: {
      tags:        ['Criteria'],
      summary:     'Create a new evaluation criterion',
      description: 'Adds a criterion (e.g. "Innovation") with a weight and max score.',
      body: { $ref: 'CriteriaInput#' },
      response: {
        201: { $ref: 'Criteria#' },
        400: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.createCriteria,
  });

  // GET /criteria — List all criteria
  fastify.route({
    method:  'GET',
    url:     '/',
    schema: {
      tags:     ['Criteria'],
      summary:  'List all criteria',
      response: {
        200: { type: 'array', items: { $ref: 'Criteria#' } },
      },
    },
    handler: controller.getAllCriteria,
  });
}

module.exports = criteriaRoutes;
