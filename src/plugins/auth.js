'use strict';

const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');

async function authPlugin(fastify, options) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'super_secret_fallback_key_please_change_in_production'
  });

  // Base authentication
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Role: Admin
  fastify.decorate('requireAdmin', async function (request, reply) {
    try {
      await request.jwtVerify();
      if (request.user.role !== 'admin') {
        const error = new Error('Forbidden: Admins only');
        error.statusCode = 403;
        throw error;
      }
    } catch (err) {
      reply.send(err);
    }
  });

  // Role: Judge
  fastify.decorate('requireJudge', async function (request, reply) {
    try {
      await request.jwtVerify();
      if (request.user.role !== 'judge') {
        const error = new Error('Forbidden: Judges only');
        error.statusCode = 403;
        throw error;
      }
    } catch (err) {
      reply.send(err);
    }
  });

  // Role: Author
  fastify.decorate('requireAuthor', async function (request, reply) {
    try {
      await request.jwtVerify();
      if (request.user.role !== 'author') {
        const error = new Error('Forbidden: Authors only');
        error.statusCode = 403;
        throw error;
      }
    } catch (err) {
      reply.send(err);
    }
  });
}

module.exports = fp(authPlugin);
