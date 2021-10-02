# Translation-Caching

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/shreenanda-8)



 
<p align="center">
  


  <strong>
    <h3 align="center" >Translation-Caching</h3>
  </strong>
  <p align="center">
   A web server that exposes an API to translate a text
    <br />
    <br />
   <a href="https://github.com/shreenanda-8/Translation-Caching/issues/">Report Bug</a>
    ·
    <a href="https://github.com/shreenanda-8/Translation-Caching/issues/">Request Feature</a>
  </p>
</p>

   
## Design Decisions
1. Express framework is used.
2. Redis is used which works as an in-memory dataset (For caching).
3. Data is stored in Key-Value pairs. 
```
    __________________________________________________________________
   |____________KEY______________________________VALUE_______________|
   |                                |                                |
   | sourceText:targetLanguage      |        translatedText          |
   |________________________________|________________________________|
   ```
4. controller folder has the functionality to translate the text (With Smart pre-caching).
5. utils folder has all the middlewares needed (Checks if data is present in the cache or not).
6. If there are similar languages, for each language, a child process is forked from the main process and they are simultaneously translated to reduce the response time of the API.
7. Then these translated data are sent back to the main process, where pre-caching is performed.
7. vitalets/google-translate-api module is used to translate the text.
9. Text and language code are passed as parameters to the API.
<br/>

Architecture
:-------------------------:
![Architecture](https://user-images.githubusercontent.com/54429809/135699836-4e3f3839-55dc-4535-812b-b6f61a789701.png)

<br />


## Features

| Feature                    |  Coded?  | Description                                                   |
| -------------------------- | :------: | :------------------------------------------------------------ |
| Translate          | &#10004; | Text translation from one language to another.|
| Persistent Caching               | &#10004; |  Caching the translations, to avoid repeated hits to the translation API.|
| Smart pre-caching                  | &#10004; | Source text is also translated to similar languages and stored in the cache without affecting the response time of API. |
<br/>

## Screenshots

 First Hit to the API            |  Second Hit to the API (Caching)
:-------------------------:|:-------------------------:
![FirstHit](https://user-images.githubusercontent.com/54429809/135702918-34aa204f-8765-4803-b4ea-74221b496493.png)|![SecondHit](https://user-images.githubusercontent.com/54429809/135702925-45fcd5f3-c27b-43b6-b1c7-142c92921d87.png)
<br/>

Smart Pre-Caching (by providing similar language as a target language)
:-------------------------:
![Smart Caching](https://user-images.githubusercontent.com/54429809/135702930-9921872c-cf92-4dc9-a49c-32fff79ad475.png)

<br />
<br />

## Guide to use this API.

###### Provide your source text and the target language(in ISO 639-1 format) to translate.

<a href="https://lingohub.com/academy/best-practices/iso-639-1-list">For the Reference</a>


```
   {
       "source" : "Hello, I am a very good singer",
       "targetLanguage" : "hi"
   }
 ```
##### Result

```
  {
      "success": true,
      "data": {
         "translatedText": "नमस्ते, मैं एक बहुत अच्छा गायक हूँ"
       },
      "time": "1108 ms"
  }
```
## Setup and Running the Server/App
---
### 1. 🔰Clone the Repository


###### Use the `git clone` command along with the URL of the repository.

```
git clone https://github.com/shreenanda-8/Translation-Caching.git
```

###### Now we have the copy of the file in our computer.







### 2. 🔰Download and Run Redis Server in background

###### This will act as local database for caching.

### For Windows users,
###### Download it from :-

```
https://github.com/dmajkic/redis/downloads
```
###### Download the first zip and install it in your local windows environment.

###### After downloading redis zip, extract it and go to the location where you extracted the file (useing command prompt). Once you are in the directory where you extracted the zip,
###### Then follow the steps: 
Run 
```
cd redis-2.4.5-win32-win64
```

```
cd 64bit
``` 
and finally run
```
redis-server
```

### For Linux users,
###### Use the following command to install homebrew.
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

###### Then run
```
brew install redis
```
```
redis-cli
``` 


###### Now redis server starts running in the background at the PORT `6379`.


### 3. 🔀Navigate to the repository folder

###### To run the project in your local environment, we have to install all the dependencies first:

##### This can be done with a simple command
```
npm install
```

### 4. 🔀Run the App in your localhost 

###### Use the following command to run the server locally.
```
npm run dev
```
###### Now server will start running at the PORT `3001`

---


 


## Built With


* [NODE](https://nodejs.org/en/docs/)
* [EXPRESS](https://expressjs.com/en/starter/installing.html)
* [REDIS](https://redis.io/documentation)






