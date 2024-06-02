// app.js
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');  
const dbconnect = require('./config');

const usersRouter = require('./routes/register');
const travelsRouter = require('./routes/travels');
const travelRouter = require('./routes/travel');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/register', usersRouter);
app.use('/api/travels', travelsRouter);
app.use('/api/travel', travelRouter);

// Manejo de errores
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
