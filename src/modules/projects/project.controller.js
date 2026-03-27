'use strict';

const service = require('./project.service');

/**
 * HTTP layer for projects.
 */

async function createProject(request, reply) {
  const project = await service.createProject(request.body);
  reply.status(201).send(project);
}

async function getAllProjects(request, reply) {
  const projects = await service.getAllProjects();
  reply.send(projects);
}

async function getProjectById(request, reply) {
  const project = await service.getProjectById(parseInt(request.params.id, 10));
  reply.send(project);
}

module.exports = { createProject, getAllProjects, getProjectById };
