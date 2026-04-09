'use strict';

const service = require('./project.service');

class ProjectController {
  async getProjects(request, reply) {
    const projects = await service.getProjects();
    reply.send(projects);
  }

  async getProject(request, reply) {
    const project = await service.getProject(request.params.id);
    reply.send(project);
  }

  async createProject(request, reply) {
    // author_id comes from JWT token! No need to pass it in the body.
    const author_id = request.user.id; 
    const project = await service.createProject(request.body, author_id);
    reply.status(201).send(project);
  }

  async updateProject(request, reply) {
    const project = await service.updateProject(request.params.id, request.body, request.user);
    reply.send(project);
  }

  async deleteProject(request, reply) {
    await service.deleteProject(request.params.id, request.user);
    reply.status(204).send();
  }
}

module.exports = new ProjectController();
