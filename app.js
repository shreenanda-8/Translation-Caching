const express = require('express');

const morgan = require('morgan');

const app = express();

const Translate = require("./controllers/translate");

const {Cache, Cors} =  require("./utils/middlewares");

const dotenv = require('dotenv');

dotenv.config();

app.use(morgan('dev'));

app.use(express.json());

app.use(Cors)

app.use('/translate', Cache, Translate);

module.exports = app;
