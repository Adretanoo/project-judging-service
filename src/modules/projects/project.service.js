'use strict';

const repo = require('./project.repository');

/**
 * Business logic for projects.
 */

async function createProject(data) {
  return repo.createProject(data);
}

async function getAllProjects() {
  return repo.getAllProjects();
}

async function getProjectById(id) {
  const project = await repo.getProjectById(id);
  if (!project) {
    const err = new Error(`Project with id ${id} not found`);
    err.statusCode = 404;
    throw err;
  }
  return project;
}

module.exports = { createProject, getAllProjects, getProjectById };
