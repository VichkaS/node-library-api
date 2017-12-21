const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes);

app.use((req, res, next) => {
    res.json({
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

require('dotenv').config({path: 'variables.env'});


mongoose.connect(process.env.DATABASE, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});
mongoose.connection.once('open', (err) => {
    console.error('MongoDB connected');
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running`);
});