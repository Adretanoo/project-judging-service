'use strict';

async function judgeRoutes(fastify) {
  // 1. Basic Welcome Route (as requested)
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Judges'],
      summary: 'Welcome route',
    },
    handler: async (request, reply) => {
      return { message: 'Welcome to the Judging Service' };
    },
  });

  // 2. Get all judges placeholder
  fastify.route({
    method: 'GET',
    url: '/list',
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Judges'],
      summary: 'Get all judges',
      security: [{ bearerAuth: [] }],
      response: {
        200: { type: 'object' },
      },
    },
    handler: async (request, reply) => {
      return { success: true, route: 'GET /judges/list' };
    },
  });

  // 3. Get judge by ID placeholder
  fastify.route({
    method: 'GET',
    url: '/:id',
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Judges'],
      summary: 'Get judge by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
      response: {
        200: { type: 'object' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: async (request, reply) => {
      return { success: true, route: `GET /judges/${request.params.id}` };
    },
  });

  // 4. Create judge placeholder
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: [fastify.requireAdmin],
    schema: {
      tags: ['Judges'],
      summary: 'Register a new judge (Admin only)',
      security: [{ bearerAuth: [] }],
      body: { $ref: 'JudgeInput#' },
      response: {
        201: { type: 'object' },
        409: { $ref: 'ErrorResponse#' },
      },
    },
    handler: async (request, reply) => {
      return { success: true, route: 'POST /judges' };
    },
  });
}

module.exports = judgeRoutes;
