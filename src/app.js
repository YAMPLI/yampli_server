require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./api/routes');

// const conn = require('./config/conn.js');

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// conn();

app.use('/api', route);

app.listen(port, () => console.log('server listening on port' + port));
