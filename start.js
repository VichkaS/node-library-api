const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});
mongoose.connection.once('open', (err) => {
    console.error('MongoDB connected');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

