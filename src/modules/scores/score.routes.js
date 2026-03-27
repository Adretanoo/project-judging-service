'use strict';

const controller = require('./score.controller');

/**
 * Fastify route definitions for the /scores prefix.
 */
async function scoreRoutes(fastify) {
  // POST /scores — Submit a score
  fastify.route({
    method:  'POST',
    url:     '/',
    schema: {
      tags:        ['Scores'],
      summary:     'Submit a score',
      description: 'A judge submits a score for a specific project and criterion. Each judge may score each (project, criterion) pair only once.',
      body: { $ref: 'ScoreInput#' },
      response: {
        201: { $ref: 'Score#' },
        400: { $ref: 'ErrorResponse#' },
        404: { $ref: 'ErrorResponse#' },
        409: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.createScore,
  });

  // GET /scores/project/:id — Get all scores for a project
  fastify.route({
    method:  'GET',
    url:     '/project/:id',
    schema: {
      tags:        ['Scores'],
      summary:     'Get all scores for a project',
      description: 'Returns every score submitted for the given project, enriched with judge and criteria details.',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
        required: ['id'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id:                   { type: 'integer' },
              score_value:          { type: 'number'  },
              comment:              { type: 'string'  },
              judge_id:             { type: 'integer' },
              judge_name:           { type: 'string'  },
              criteria_id:          { type: 'integer' },
              criteria_name:        { type: 'string'  },
              criteria_weight:      { type: 'number'  },
              criteria_max_score:   { type: 'integer' },
            },
          },
        },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: controller.getScoresByProject,
  });
}

module.exports = scoreRoutes;
