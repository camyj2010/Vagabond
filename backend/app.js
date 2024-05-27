const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const router = require('./routes');
const dbconnect = require('./config');


app.use(express.json());
app.use(cors());
app.use('/api', router);

    
module.exports = app
