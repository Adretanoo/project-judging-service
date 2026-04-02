'use strict';

const fastify = require('fastify')({ logger: true });

// ─── Plugins ─────────────────────────────────────────────────────────────────
fastify.register(require('./plugins/auth'));
fastify.register(require('./plugins/swagger'));

// ─── Modules (feature routes) ─────────────────────────────────────────────────
fastify.register(require('./modules/auth/auth.routes'),            { prefix: '/auth' });
fastify.register(require('./modules/judges/judge.routes'),         { prefix: '/judges' });
fastify.register(require('./modules/projects/project.routes'),     { prefix: '/projects' });
fastify.register(require('./modules/criteria/criteria.routes'),    { prefix: '/criteria' });
fastify.register(require('./modules/scores/score.routes'),         { prefix: '/scores' });
fastify.register(require('./modules/leaderboard/leaderboard.routes'), { prefix: '/leaderboard' });

// ─── Global error handler ─────────────────────────────────────────────────────
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    statusCode,
    error: error.name || 'Internal Server Error',
    message: error.message,
  });
});

module.exports = fastify;
