const express = require('express');

const app = express();

const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

var axios = require("axios").default;

const DetectLanguage = async (source) => {
    let detect = {
        method: 'POST',
        url: 'https://translo.p.rapidapi.com/detect',
        params: {'text': source},
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'translo.p.rapidapi.com',
            'x-rapidapi-key': `${process.env.API_KEY}`
        },
        data: { text: 'Hello, world! I\'m great developer!' }
    };
    try {
        const response = await axios.request(detect);
       
        return response.data.lang;
    }
    catch (Err) {

        return Err;
    }
}

const TranslateLanguage = async(source, sourceLanguage, targetLanguage) => {
    let translate = {
        method: 'POST',
        url: 'https://translo.p.rapidapi.com/translate',
        params: { text: source, to: targetLanguage, from: sourceLanguage },
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'translo.p.rapidapi.com',
            'x-rapidapi-key': `${process.env.API_KEY}`
        },
        data: { key1: 'value', key2: 'value' }
    };
    try{
        const response = await axios.request(translate);
        
        return response.data.translated_text;
    }
    catch(Err)
    {
        return Err;
    }
}

app.post('/translate', async (request, response) => {
    const body = request.body;
    const detectLangResponse = await DetectLanguage(body.source);
    
    if(detectLangResponse.response)
    {
    
      return response.status(detectLangResponse.response.status).json({error: detectLangResponse.response.data.message});
    }
    const sourceLanguage = detectLangResponse;

    const translatedSource = await TranslateLanguage(body.source, sourceLanguage, body.targetLanguage);

    if(translatedSource.response)
    {
       
       return response.status(translatedSource.response.status).json({error: translatedSource.response.data.message});
    }
    
     response.status(200).json({ translatedSource: translatedSource});
})




module.exports = app;
