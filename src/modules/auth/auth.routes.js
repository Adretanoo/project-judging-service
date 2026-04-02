'use strict';

const controller = require('./auth.controller');

async function authRoutes(fastify) {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password', 'full_name', 'role'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          full_name: { type: 'string' },
          role: { type: 'string', enum: ['author', 'judge', 'admin'] }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                full_name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        }
      }
    },
    handler: controller.register
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['Auth'],
      summary: 'Login and get JWT token',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                full_name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        }
      }
    },
    handler: controller.login
  });
}

module.exports = authRoutes;
