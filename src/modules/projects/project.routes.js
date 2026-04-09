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

  fastify.route({
    method: 'PUT',
    url: '/:id',
    preValidation: [fastify.authenticate], // Both author and admin can use this (service layer validates specific author matching)
    schema: {
      tags: ['Projects'],
      summary: 'Update project (Author only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
      body: { $ref: 'ProjectInput#' },
      response: {
        200: { $ref: 'Project#' },
        403: { $ref: 'ErrorResponse#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.updateProject,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    preValidation: [fastify.authenticate], // Handled by service layer mapping
    schema: {
      tags: ['Projects'],
      summary: 'Delete project (Author only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
      response: {
        204: { type: 'null' },
        403: { $ref: 'ErrorResponse#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.deleteProject,
  });
}

module.exports = projectRoutes;
