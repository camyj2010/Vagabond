// app.js
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const router = require('./routes');  // Ensure this path is correct
const dbconnect = require('./config');

app.use(express.json());
app.use(cors());
app.use('/api', router);  // This should now be correct

module.exports = app;