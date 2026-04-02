'use strict';

const service = require('./auth.service');

async function register(request, reply) {
  const user = await service.register(request.body);
  const token = await reply.jwtSign({
    id: user.id,
    role: user.role,
    email: user.email
  });
  reply.status(201).send({ user, token });
}

async function login(request, reply) {
  const user = await service.login(request.body);
  const token = await reply.jwtSign({
    id: user.id,
    role: user.role,
    email: user.email
  });
  reply.send({ user, token });
}

module.exports = { register, login };
