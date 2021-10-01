const googleTranslate = require('@vitalets/google-translate-api');

const output = {};
process.on('message', async (message) => {
  try {
    const response = await googleTranslate(message.data.source,
      { to: message.data.targetLanguage });
    output.translatedText = response.text;
    process.send(output);
    process.exit();
  } catch (Err) {
    process.exit();
  }
});
