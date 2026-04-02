'use strict';

const controller = require('./criteria.controller');

async function criteriaRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/',
    // Open for all authenticated users to see criteria
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Criteria'],
      summary: 'Get all evaluation criteria',
      security: [{ bearerAuth: [] }],
      response: {
        200: { type: 'array', items: { $ref: 'Criteria#' } },
      },
    },
    handler: controller.getAllCriteria,
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Criteria'],
      summary: 'Get criteria by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
      response: {
        200: { $ref: 'Criteria#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.getCriteriaById,
  });

  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: [fastify.requireAdmin], // Admin only!
    schema: {
      tags: ['Criteria'],
      summary: 'Create new criteria (Admin only)',
      security: [{ bearerAuth: [] }],
      body: { $ref: 'CriteriaInput#' },
      response: {
        201: { $ref: 'Criteria#' },
      },
    },
    handler: controller.createCriteria,
  });
}

module.exports = criteriaRoutes;
