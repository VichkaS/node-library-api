const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes);

app.use((req, res, next) => {
    res.status(404).json({
        error_code: 404,
        message: 'not found',
    });
  });

app.use((err, req, res, next) => {
    console.log(err);
    res.json({
        error_code: 500,
        message: err.message,
    });
});

module.exports = app;
