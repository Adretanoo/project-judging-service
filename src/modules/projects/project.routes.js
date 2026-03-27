'use strict';

const controller = require('./project.controller');

/**
 * Fastify route definitions for the /projects prefix.
 */
async function projectRoutes(fastify) {
  // POST /projects — Create a new project
  fastify.route({
    method:  'POST',
    url:     '/',
    schema: {
      tags:        ['Projects'],
      summary:     'Create a new project',
      description: 'Registers a new project/team for judging.',
      body: { $ref: 'ProjectInput#' },
      response: {
        201: { $ref: 'Project#' },
        400: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.createProject,
  });

  // GET /projects — List all projects
  fastify.route({
    method:  'GET',
    url:     '/',
    schema: {
      tags:     ['Projects'],
      summary:  'List all projects',
      response: {
        200: { type: 'array', items: { $ref: 'Project#' } },
      },
    },
    handler: controller.getAllProjects,
  });

  // GET /projects/:id — Get a single project
  fastify.route({
    method:  'GET',
    url:     '/:id',
    schema: {
      tags:    ['Projects'],
      summary: 'Get a project by ID',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
        required: ['id'],
      },
      response: {
        200: { $ref: 'Project#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.getProjectById,
  });
}

module.exports = projectRoutes;
