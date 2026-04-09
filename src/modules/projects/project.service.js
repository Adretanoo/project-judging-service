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

  async updateProject(id, data, user) {
    const project = await this.getProject(id);
    
    if (user.role !== 'admin' && project.author_id !== user.id) {
      const err = new Error('Forbidden: You can only edit your own projects');
      err.statusCode = 403;
      throw err;
    }

    const updated = await repo.update(id, data);
    return updated;
  }

  async deleteProject(id, user) {
    const project = await this.getProject(id);

    if (user.role !== 'admin' && project.author_id !== user.id) {
      const err = new Error('Forbidden: You can only delete your own projects');
      err.statusCode = 403;
      throw err;
    }

    return repo.delete(id);
  }
}

module.exports = new ProjectService();
