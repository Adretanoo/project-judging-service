'use strict';

const repo = require('./project.repository');

class ProjectService {
  async getProjects() {
    return repo.findAll();
  }

  async getProject(id) {
    const project = await repo.findById(id);
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    return project;
  }

  async createProject(data, author_id) {
    return repo.create({ ...data, author_id });
  }
}

module.exports = new ProjectService();
