

const redis = require('redis');

const REDIS_PORT =  process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const Cors = (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'POST');
        return response.status(200).json({});
    }
    next();
}
const Cache =  (request, response, next) => {
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
}
let objects = {
    Cache: Cache,
    Cors: Cors
}
module.exports = objects;