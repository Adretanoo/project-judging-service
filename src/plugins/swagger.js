'use strict';

const fp = require('fastify-plugin');

/**
 * Registers @fastify/swagger + @fastify/swagger-ui AND calls fastify.addSchema()
 * for every shared schema so Fastify's AJV validator can resolve $ref references
 * used in route validation schemas.
 *
 * IMPORTANT: fastify-plugin breaks encapsulation so child scopes (routes) see
 * the registered schemas. This plugin must be registered BEFORE any routes.
 */
async function swaggerPlugin(fastify) {
  // ── 1. Register AJV-visible schemas ────────────────────────────────────────
  // These are what Fastify uses for REQUEST/RESPONSE validation.
  // The $id value becomes the $ref anchor: { $ref: 'JudgeInput#' }

  fastify.addSchema({
    $id: 'JudgeInput',
    type: 'object',
    required: ['full_name', 'email'],
    properties: {
      full_name: { type: 'string', examples: ['Jane Doe'] },
      email: { type: 'string', format: 'email', examples: ['jane@example.com'] },
    },
  });

  fastify.addSchema({
    $id: 'Judge',
    type: 'object',
    properties: {
      id: { type: 'integer', examples: [1] },
      full_name: { type: 'string', examples: ['Jane Doe'] },
      email: { type: 'string', examples: ['jane@example.com'] },
      created_at: { type: 'string', format: 'date-time' },
    },
  });

  fastify.addSchema({
    $id: 'ProjectInput',
    type: 'object',
    required: ['title', 'team_name'],
    properties: {
      title: { type: 'string', examples: ['EcoDrive'] },
      description: { type: 'string', examples: ['An app that gamifies eco-friendly driving.'] },
      team_name: { type: 'string', examples: ['Green Wheels'] },
    },
  });

  fastify.addSchema({
    $id: 'Project',
    type: 'object',
    properties: {
      id: { type: 'integer', examples: [1] },
      title: { type: 'string', examples: ['EcoDrive'] },
      description: { type: 'string', examples: ['An app that gamifies eco-friendly driving.'] },
      team_name: { type: 'string', examples: ['Green Wheels'] },
      created_at: { type: 'string', format: 'date-time' },
    },
  });

  fastify.addSchema({
    $id: 'CriteriaInput',
    type: 'object',
    required: ['name', 'weight', 'max_score'],
    properties: {
      name: { type: 'string', examples: ['Innovation'] },
      weight: { type: 'number', examples: [0.4] },
      max_score: { type: 'integer', examples: [10] },
    },
  });

  fastify.addSchema({
    $id: 'Criteria',
    type: 'object',
    properties: {
      id: { type: 'integer', examples: [1] },
      name: { type: 'string', examples: ['Innovation'] },
      weight: { type: 'number', examples: [0.4] },
      max_score: { type: 'integer', examples: [10] },
    },
  });

  fastify.addSchema({
    $id: 'ScoreInput',
    type: 'object',
    required: ['judge_id', 'project_id', 'criteria_id', 'score_value'],
    properties: {
      judge_id: { type: 'integer', examples: [1] },
      project_id: { type: 'integer', examples: [2] },
      criteria_id: { type: 'integer', examples: [1] },
      score_value: { type: 'number', examples: [8.5] },
      comment: { type: 'string', examples: ['Very creative approach.'] },
    },
  });

  fastify.addSchema({
    $id: 'Score',
    type: 'object',
    properties: {
      id: { type: 'integer', examples: [1] },
      judge_id: { type: 'integer', examples: [1] },
      project_id: { type: 'integer', examples: [2] },
      criteria_id: { type: 'integer', examples: [1] },
      score_value: { type: 'number', examples: [8.5] },
      comment: { type: 'string', examples: ['Very creative approach.'] },
    },
  });

  fastify.addSchema({
    $id: 'LeaderboardEntry',
    type: 'object',
    properties: {
      rank: { type: 'integer', examples: [1] },
      project_id: { type: 'integer', examples: [2] },
      title: { type: 'string', examples: ['EcoDrive'] },
      team_name: { type: 'string', examples: ['Green Wheels'] },
      final_score: { type: 'number', examples: [7.65] },
    },
  });

  fastify.addSchema({
    $id: 'ErrorResponse',
    type: 'object',
    properties: {
      statusCode: { type: 'integer', examples: [400] },
      error: { type: 'string', examples: ['Bad Request'] },
      message: { type: 'string', examples: ['Validation error message'] },
    },
  });

  // ── 2. Register @fastify/swagger (OpenAPI spec generator) ─────────────────
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Automated Project Judging Service',
        description: 'REST API for evaluating projects using weighted criteria and calculating leaderboards.',
        version: '1.0.0',
      },
      tags: [
        { name: 'Judges', description: 'Manage judges' },
        { name: 'Projects', description: 'Manage hackathon / competition projects' },
        { name: 'Criteria', description: 'Manage evaluation criteria and their weights' },
        { name: 'Scores', description: 'Submit and query scores' },
        { name: 'Leaderboard', description: 'Ranked project results' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        { bearerAuth: [] }
      ]
    },
  });

  // ── 3. Register Swagger UI at /docs (dark theme) ─────────────────────────
  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
    theme: {
      css: [
        {
          filename: 'dark-theme.css',
          content: `
/* ── Swagger UI Dark Theme ────────────────────────────────────────────────── */

/* Base & body */
body { background: #0f1117 !important; }

.swagger-ui { color: #c9d1d9 !important; }

.swagger-ui .topbar { background: #161b22 !important; border-bottom: 1px solid #30363d !important; }
.swagger-ui .topbar a { color: #58a6ff !important; }
.swagger-ui .topbar .download-url-input { background: #0d1117 !important; border-color: #30363d !important; color: #c9d1d9 !important; }

/* Info section */
.swagger-ui .info .title { color: #e6edf3 !important; }
.swagger-ui .info p,
.swagger-ui .info li,
.swagger-ui .info h1,
.swagger-ui .info h2,
.swagger-ui .info h3 { color: #c9d1d9 !important; }
.swagger-ui .info a { color: #58a6ff !important; }

/* Scheme / server select */
.swagger-ui .scheme-container { background: #161b22 !important; border: 1px solid #30363d !important; box-shadow: none !important; }
.swagger-ui select { background: #1c2128 !important; color: #c9d1d9 !important; border-color: #30363d !important; }

/* Tags / operation blocks */
.swagger-ui .opblock-tag { color: #e6edf3 !important; border-bottom: 1px solid #30363d !important; }
.swagger-ui .opblock-tag:hover { background: #161b22 !important; }

.swagger-ui .opblock { background: #161b22 !important; border-color: #30363d !important; box-shadow: none !important; }
.swagger-ui .opblock .opblock-summary { border-bottom: 1px solid #30363d !important; }
.swagger-ui .opblock .opblock-summary-description { color: #8b949e !important; }
.swagger-ui .opblock .opblock-summary-path { color: #c9d1d9 !important; }
.swagger-ui .opblock .opblock-summary-path__deprecated { color: #8b949e !important; }

/* HTTP method badges */
.swagger-ui .opblock.opblock-get    { background: #0d2137 !important; border-color: #1f6feb !important; }
.swagger-ui .opblock.opblock-post   { background: #0d2b0d !important; border-color: #2ea043 !important; }
.swagger-ui .opblock.opblock-put    { background: #2b1d00 !important; border-color: #9e6a03 !important; }
.swagger-ui .opblock.opblock-delete { background: #2d0f0f !important; border-color: #da3633 !important; }
.swagger-ui .opblock.opblock-patch  { background: #1b1b2b !important; border-color: #6e40c9 !important; }

.swagger-ui .opblock-summary-method { border-radius: 4px !important; }

/* Expanded operation body */
.swagger-ui .opblock-body { background: #0d1117 !important; }
.swagger-ui .opblock-section-header { background: #161b22 !important; border-bottom: 1px solid #30363d !important; }
.swagger-ui .opblock-section-header h4,
.swagger-ui .opblock-section-header label { color: #c9d1d9 !important; }

/* Tables */
.swagger-ui table thead tr td,
.swagger-ui table thead tr th { color: #8b949e !important; border-bottom: 1px solid #30363d !important; }
.swagger-ui table tbody tr td { color: #c9d1d9 !important; border-bottom: 1px solid #21262d !important; }
.swagger-ui .parameter__name { color: #e6edf3 !important; }
.swagger-ui .parameter__type { color: #7ee787 !important; }
.swagger-ui .parameter__in   { color: #8b949e !important; }

/* Code / json */
.swagger-ui .highlight-code,
.swagger-ui .microlight { background: #0d1117 !important; color: #c9d1d9 !important; }
.swagger-ui .model-box { background: #161b22 !important; }
.swagger-ui .model { color: #c9d1d9 !important; }
.swagger-ui .model-title { color: #e6edf3 !important; }
.swagger-ui .prop-type { color: #7ee787 !important; }
.swagger-ui .prop-format { color: #8b949e !important; }

/* Response section */
.swagger-ui .responses-inner { background: #0d1117 !important; }
.swagger-ui .response-col_status { color: #58a6ff !important; }
.swagger-ui .response-col_description { color: #c9d1d9 !important; }

/* Inputs & textareas */
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui input[type=email],
.swagger-ui textarea { background: #0d1117 !important; color: #c9d1d9 !important; border: 1px solid #30363d !important; }
.swagger-ui input[type=text]:focus,
.swagger-ui textarea:focus { border-color: #58a6ff !important; outline: none !important; }

/* Buttons */
.swagger-ui .btn { border-color: #30363d !important; color: #c9d1d9 !important; background: #21262d !important; }
.swagger-ui .btn:hover { background: #30363d !important; }
.swagger-ui .btn.execute { background: #1f6feb !important; border-color: #1f6feb !important; color: #fff !important; }
.swagger-ui .btn.execute:hover { background: #388bfd !important; }
.swagger-ui .btn.cancel  { background: #da3633 !important; border-color: #da3633 !important; color: #fff !important; }
.swagger-ui .btn.authorize { background: #2ea043 !important; border-color: #2ea043 !important; color: #fff !important; }

/* Scrollbar (webkit) */
.swagger-ui ::-webkit-scrollbar { width: 8px; height: 8px; }
.swagger-ui ::-webkit-scrollbar-track { background: #0d1117; }
.swagger-ui ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
.swagger-ui ::-webkit-scrollbar-thumb:hover { background: #484f58; }
          `,
        },
      ],
    },
  });
}

module.exports = fp(swaggerPlugin);

