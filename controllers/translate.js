const Router = require('express').Router();

const { fork } = require('child_process');

const path = require('path');

const redis = require('redis');

const googleTranslate = require('@vitalets/google-translate-api');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

// Language translations that user might be looking for.
// (Country wise for Smart Caching)

const similarLangList = [
  ['hi', 'kn', 'bn', 'gu', 'pa', 'ta', 'te'],

  ['fr', 'de', 'it', 'es', 'nl'],
];

Router.post('/', async (request, response) => {
  // Record the response time
  const startTime = new Date().getTime();
  const { body } = request;

  if (body.source.length === 0 || body.targetLanguage.length === 0) {
    return response.status(404).json({ success: false, error: 'Insufficient Information' });
  }
  const output = {};

  try {
    const translateRes = await googleTranslate(body.source, { to: body.targetLanguage });

    output.translatedText = translateRes.text;

    client.setex(`${body.source}:${body.targetLanguage}`, 3600, output.translatedText);
  } catch (error) {
    if (error.code) {
      return response.status(error.code).json({ success: false, error: error.message });
    }
    return response.status(500).json({ success: false, error: error.message });
  }

  // Smart Caching
  similarLangList.forEach((compare) => {
    if (compare.includes(body.targetLanguage)) {
      compare.forEach((lang) => {
        if (lang !== body.targetLanguage) {
          // Handling each translation in a separate child process inorder to save time
          const childProcess = fork(path.join(__dirname, '/childProcess'));
          childProcess.send({ data: { source: body.source, targetLanguage: lang } });
          childProcess.on('message', (message) => {
            client.setex(`${body.source}:${lang}`, 3600, message.translatedText);
          });
        }
      });
    }
  });
  return response.status(200).json({
    success: true,
    data: output,
    time: `${(new Date().getTime() - startTime)} ms`,
  });
});

module.exports = Router;
