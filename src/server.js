'use strict';

require('dotenv').config();
const app = require('./app');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT, 10) || 3000;

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀  Server listening on http://${HOST}:${PORT}`);
    console.log(`📄  Swagger UI available at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
