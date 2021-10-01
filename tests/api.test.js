const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Request = async (body) => api
  .post('/translate')
  .send(body);
const ResponseTimeCompare = (startTime, endTime) => {
  // Slice last 2 charactes (700ms)
  const difference = Number(startTime.slice(0, -2)) - Number(endTime.slice(0, -2));
  return difference < 0 ? 'Less' : 'More';
};

describe('Testing API endpoints', () => {
  const data = {
    source: 'Hello, I hope you are doing greate',
    targetLanguage: 'kn',
  };

  test('Translation', async () => {
    const body = data;
    const response = await api
      .post('/translate')
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.success === true && response.body.translatedText === 'ಹಲೋ, ನೀವು ಉತ್ತಮವಾಗಿ ಮಾಡುತ್ತಿರುವೆ ಎಂದು ನಾನು ಭಾವಿಸುತ್ತೇನೆ');
  });

  test('Empty Source', async () => {
    const body = data;
    body.source = '';

    const response = await api
      .post('/translate')
      .send(body)
      .expect(404)
      .expect('Content-Type', /application\/json/);
    expect(response.body.success === false && response.body.error === 'Insufficient Information');
  });
  test('Empty targetLanguage', async () => {
    const body = data;
    body.targetLanguage = '';

    const response = await api
      .post('/translate')
      .send(body)
      .expect(404)
      .expect('Content-Type', /application\/json/);
    expect(response.body.success === false && response.body.error === 'Insufficient Information');
  });

  test('Unsopported Language', async () => {
    const body = data;
    body.targetLanguage = 'tm';

    const response = await api
      .post('/translate')
      .send(body)
      .expect(404)
      .expect('Content-Type', /application\/json/);
    expect(response.body.success === false);
  });
});

describe('Testing the Response time after Caching', () => {
  const data = {
    source: 'Hello, I am a very happy person',
    targetLanguage: 'kn',
  };
  test('Two repeated hits to the API with same input', async () => {
    const firstResponse = await Request(data);
    const secondResponse = await Request(data);
    expect(ResponseTimeCompare(firstResponse.body.time, secondResponse.body.time) === 'Less');
  });
  test('Smart Caching (Repeated hits to the API with different input)', async () => {
    const body = data;
    body.source = 'Hello, I am a very good person';
    const firstResponse = await Request(body);

    // Change the language inorder to check smart caching
    body.targetLanguage = 'hi';

    const secondResponse = await Request(body);

    expect(ResponseTimeCompare(firstResponse.body.time, secondResponse.body.time) === 'Less');
  });
});
