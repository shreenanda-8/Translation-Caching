const supertest = require("supertest");
const app = require('../app');

const api = supertest(app);



const Request = async(body) => {

   
   return await api
        .post('/translate')
        .send(body)
}
const ResponseTimeCompare = (startTime, endTime) => {
   //Slice last 2 charactes (700ms)
    let difference = Number(startTime.slice(0,-2)) - Number(endTime.slice(0,-2));
   return difference < 0 ? "Less" : "More" ;
}


describe('Testing API endpoints', () => {
    let data = {
        "source": "Hello, I hope you are doing greate",
        "targetLanguage": "kn"
    }
    
    
    test('Translation', async () => {
        let body = data;
        const response = await api
        .post('/translate')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/);
        expect(response.body.success === true && response.body.translatedText === 'ಹಲೋ, ನೀವು ಉತ್ತಮವಾಗಿ ಮಾಡುತ್ತಿರುವೆ ಎಂದು ನಾನು ಭಾವಿಸುತ್ತೇನೆ');
    
    })

    

  
    test('Empty Source', async () => {
        let body = data;
        body.source = "";
       
        const response = await api
        .post('/translate')
        .send(body)
        .expect(404)
        .expect('Content-Type', /application\/json/);
        expect(response.body.success === false && response.body.error === "Insufficient Information");
    })
    test('Empty targetLanguage', async () => {
        let body = data;
        body.targetLanguage = "";
       
        const response = await api
        .post('/translate')
        .send(body)
        .expect(404)
        .expect('Content-Type', /application\/json/);
        expect(response.body.success === false && response.body.error === "Insufficient Information");
    })

    test('Unsopported Language', async() => {
      
        let body = data;
        body.targetLanguage = 'tm';
        
        const response = await api
        .post('/translate')
        .send(body)
        .expect(404)
        .expect('Content-Type', /application\/json/);
        expect(response.body.success === false);
    })
    
    
})

describe('Testing the Response time after Caching', () => {
    let data = {
        "source": "Hello, I am a very happy person",
        "targetLanguage": "kn"
    }
    test('Two repeated hits to the API with same input', async() => {
    
      
        let First_response = await Request(data);
        let Second_response = await Request(data);
        expect(ResponseTimeCompare(First_response.body.time, Second_response.body.time) === "Less");

    })
    test('Smart Caching (Repeated hits to the API with different input)', async() => {
        let body = data;
        body.source = "Hello, I am a very good person";
        let First_response = await Request(body);
        
        
        //Change the language inorder to check smart caching
        body.targetLanguage = 'hi';
   
        let Second_response = await Request(body);
       
       
        expect(ResponseTimeCompare(First_response.body.time, Second_response.body.time) === "Less");
    })
  
})




