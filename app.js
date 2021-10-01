const express = require('express');

const app = express();

const { fork } = require('child_process');

const redis = require('redis');

const dotenv = require('dotenv');

const googleTranslate = require('@vitalets/google-translate-api');


dotenv.config();

const REDIS_PORT =  process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

app.use(express.json());

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'POST');
        return response.status(200).json({});
    }
    next();
})

app.use((request, response, next) => {
    let startTime = new Date().getTime();
    const body = request.body;
   
    client.get(body.source + ':' + body.targetLanguage, (err, data) => {
        if (err) {
            console.log(err);
        }

        let output = {};
        if (data !== null) {

            output.translatedText = data;
            return response.status(200).json({
                success: true,
                data: output,
                time: `${(new Date().getTime() - startTime)} ms`
            });
        }
        next();
    })
})

const similarLangList = [
    ["hi", "kn", "bn", "gu", "pa", "ta", "te"],
   
    ["fr", "de", "it", "es", "nl"]
]


app.post('/translate', async (request, response) => {
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
                    let childProcess = fork('./childProcess.js');
                    childProcess.send({ "data": { source: body.source, targetLanguage: lang } });
                    childProcess.on("message", (message) => {

                        client.setex(body.source + ':' + lang, 30, message.translatedText)
                    });
                }


            }
        }
    }
})

module.exports = app;
