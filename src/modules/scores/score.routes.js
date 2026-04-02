'use strict';

const controller = require('./score.controller');

async function scoreRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/project/:projectId',
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Scores'],
      summary: 'Get all scores for a specific project',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'integer' } },
      },
      response: {
        200: { type: 'array', items: { $ref: 'Score#' } },
      },
    },
    handler: controller.getScoresByProject,
  });

  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: [fastify.authenticate], // Logic requires authenticate, role logic inside controller
    schema: {
      tags: ['Scores'],
      summary: 'Submit a new score',
      security: [{ bearerAuth: [] }],
      body: { $ref: 'ScoreInput#' },
      response: {
        201: { $ref: 'Score#' },
        409: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.createScore,
  });
}

module.exports = scoreRoutes;
