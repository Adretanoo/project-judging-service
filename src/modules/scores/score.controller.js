'use strict';

const service = require('./score.service');

class ScoreController {
  async getScoresByProject(request, reply) {
    const { projectId } = request.params;
    const scores = await service.getScoresByProject(projectId);
    reply.send(scores);
  }

  async createScore(request, reply) {
    const { role, id: userId } = request.user;
    let payload = request.body;
    
    // If user is a judge, enforce their judge_id
    if (role === 'judge') {
      const { rows } = await require('../../config/db').query("SELECT id FROM judges WHERE user_id = $1", [userId]);
      if (!rows.length) return reply.status(403).send({ message: "Judge profile not found" });
      payload.judge_id = rows[0].id;
    } else if (role !== 'admin') {
      return reply.status(403).send({ message: "Only judges or admins can submit scores" });
    }

    const score = await service.createScore(payload);
    reply.status(201).send(score);
  }
}

module.exports = new ScoreController();
