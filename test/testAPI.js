const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const User = require('../models/User');
const app = require('./app');

require('dotenv').config({path: '../variables.env'});

mongoose.connect(process.env.DATABASE_TEST, {useMongoClient: true});
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

describe('Регистрация и авторизация', () => {
    let token = '';
    
    after(() => {
        User.remove();
    });

    describe('Регистрация', () => {
        it('', (done) => {
            request(server)
            .post('/register')
            .send({

            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.property('token');
                done();
            });
        })
    })
});