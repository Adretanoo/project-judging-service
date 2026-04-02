'use strict';

const controller = require('./project.controller');

async function projectRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/',
    preValidation: [fastify.authenticate], // Needs authentication
    schema: {
      tags: ['Projects'],
      summary: 'Get all projects',
      security: [{ bearerAuth: [] }],
      response: {
        200: { type: 'array', items: { $ref: 'Project#' } },
      },
    },
    handler: controller.getProjects,
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
      response: {
        200: { $ref: 'Project#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.getProject,
  });

  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: [fastify.requireAuthor], // Authors only!
    schema: {
      tags: ['Projects'],
      summary: 'Create a new project (Author only)',
      security: [{ bearerAuth: [] }],
      body: { $ref: 'ProjectInput#' },
      response: {
        201: { $ref: 'Project#' },
      },
    },
    handler: controller.createProject,
  });
}

module.exports = projectRoutes;
