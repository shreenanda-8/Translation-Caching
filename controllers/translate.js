const Router = require('express').Router();

const { fork } = require('child_process');

const path = require('path');

const redis = require('redis');

const googleTranslate = require('@vitalets/google-translate-api');

const REDIS_PORT =  process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const similarLangList = [
    ["hi", "kn", "bn", "gu", "pa", "ta", "te"],
   
    ["fr", "de", "it", "es", "nl"]
]

Router.post('/', async (request, response) => {
    let startTime = new Date().getTime();
    const body = request.body;
   
    if (body.source.length === 0 || body.targetLanguage.length === 0) {
        return response.status(404).json({ success: false,error: "Insufficient Information" });
    }
    let output = {};

    try {

        const response = await googleTranslate(body.source, { to: body.targetLanguage });
       
        output.translatedText = response.text;
        
     
        client.setex(body.source + ':' + body.targetLanguage, 30, output.translatedText);
      
        
       
    } catch (error) {
        if (error.code) {
            return response.status(error.code).json({ success: false,error: error.message });
        }
        else {
            return response.status(500).json({ success: false,error: error.message });
        }
    }
   
   
    
    response.status(200).json({
        success: true,
        data: output,
        time: `${(new Date().getTime() - startTime)} ms`
    });

    for (let compare of similarLangList) {
    
        if (compare.includes(body.targetLanguage)) {
            for (let lang of compare) {
                if (lang !== body.targetLanguage) {
                    let childProcess = fork(path.join(__dirname, '/childProcess'));
                    childProcess.send({ "data": { source: body.source, targetLanguage: lang } });
                    childProcess.on("message", (message) => {

                        client.setex(body.source + ':' + lang, 30, message.translatedText)
                    });
                }


            }
        }
    }
})

module.exports = Router;