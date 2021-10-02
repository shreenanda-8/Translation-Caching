const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);
/* eslint-disable consistent-return */
const Cors = (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');
  if (request.method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', 'POST');
    return response.status(200).json({});
  }

  next();
};

//Middleware to check if the key is present in DB or not
const Cache = (request, response, next) => {
  // Record the response time
  const startTime = new Date().getTime();
  const { body } = request;

  client.get(`${body.source}:${body.targetLanguage}`, (err, data) => {
    if (err) {
      return response.status(err.status).json({ error: err.message });
    }

    const output = {};
    if (data !== null) {
      output.translatedText = data;
      return response.status(200).json({
        success: true,
        data: output,
        time: `${(new Date().getTime() - startTime)} ms`,
      });
    }
    next();
  });
};
const objects = {
  Cache,
  Cors,
};
module.exports = objects;
