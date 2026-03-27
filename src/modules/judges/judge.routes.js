'use strict';

const controller = require('./judge.controller');

/**
 * Fastify route definitions for the /judges prefix.
 * Each route includes a full OpenAPI schema for Swagger documentation.
 */
async function judgeRoutes(fastify) {
  // POST /judges — Create a new judge
  fastify.route({
    method:  'POST',
    url:     '/',
    schema: {
      tags:        ['Judges'],
      summary:     'Create a new judge',
      description: 'Registers a new judge in the system.',
      body: { $ref: 'JudgeInput#' },
      response: {
        201: { $ref: 'Judge#' },
        400: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.createJudge,
  });

  // GET /judges — List all judges
  fastify.route({
    method:  'GET',
    url:     '/',
    schema: {
      tags:     ['Judges'],
      summary:  'List all judges',
      response: {
        200: { type: 'array', items: { $ref: 'Judge#' } },
      },
    },
    handler: controller.getAllJudges,
  });

  // GET /judges/:id — Get a single judge
  fastify.route({
    method:  'GET',
    url:     '/:id',
    schema: {
      tags:    ['Judges'],
      summary: 'Get a judge by ID',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
        required: ['id'],
      },
      response: {
        200: { $ref: 'Judge#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.getJudgeById,
  });
}

module.exports = judgeRoutes;
