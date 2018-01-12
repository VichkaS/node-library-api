const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const User = require('../models/User');
const Book = require('../models/Book');
const stubs = require('./stubs');
const app = require('../app');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE_TEST, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

describe('Регистрация и авторизация', () => {

    describe('Регистрация', () => {

        after( async() => {
           await User.remove({});
        });

        it('Регистрация без имени', (done) => {
            const user = {
                name: '',
                email: 'bla@bla.com',
                password: 'bla',
                confirmPassword: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('All fields must be filled');
                    done();
                });
        });

        it('Регистрация без пароля', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: '',
                confirmPassword: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('All fields must be filled');
                    done();
                });
        });

        it('Регистрация без повтора пароля', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: ''
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('All fields must be filled');
                    done();
                });
        });

        it('Регистрация без почты', (done) => {
            const user = {
                name: 'name',
                email: '',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('All fields must be filled');
                    done();
                });
        });

        it('Регистрация с неправильной почтой', (done) => {
            const user = {
                name: 'name',
                email: 'bla.com',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Invalid email');
                    done();
                });
        });

        it('Регистрация с неправильной почтой. Вариант 2', (done) => {
            const user = {
                name: 'name',
                email: 'bla@com',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Invalid email');
                    done();
                });
        });

        it('Регистрация с неправильным подтверждением пароля', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: 'Bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Your passwords do not match');
                    done();
                });
        });

        it('Регистрация с неправильным подтверждением пароля. Вариант 2', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: 'another'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Your passwords do not match');
                    done();
                });
        });

        it('Правильная регистрация', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('Регистрация с уже существующей почтой', (done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.equal('User with this email exists');
                    done();
                });
        });
    });

    describe('Авторизация', () => {

        before((done) => {
            const user = {
                name: 'name',
                email: 'bla@bla.com',
                password: 'bla',
                passwordConfirm: 'bla'
            };

            request(server)
                .post('/register')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        after(async () => {
            await User.remove({});
        });

        it('Авторизация c несуществующей почтой', (done) => {
            const user = {
                email: 'blo@blo.com',
                password: 'bla'
            };

            request(server)
                .post('/auth')
                .send(user)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.equal('Authentication failed. User not found');
                    done();
                });
        });

        it('Авторизация c неверным паролем', (done) => {
            const user = {
                email: 'bla@bla.com',
                password: 'another'
            };

            request(server)
                .post('/auth')
                .send(user)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.equal('Authentication failed. Wrong password');
                    done();
                });
        });

        it('Верная авторизация', (done) => {
            const user = {
                email: 'bla@bla.com',
                password: 'bla'
            };

            request(server)
                .post('/auth')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });
    });

});

describe('Проверка корректности работы middleware для проверки токена', () => {
    let token = '';
    before((done) => {
        const user = {
            name: 'name',
            email: 'bla@bla.com',
            password: 'bla',
            passwordConfirm: 'bla'
        };

        request(server)
            .post('/register')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.token;
                done();
            });
    });

    after( async() => {
        await User.remove({});
        await Book.remove({});
    });

    it('Проверка запросов для которых нужен токен. Токена нет', (done) => {
        request(server)
            .get('/test/verify')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error_code');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('No token provided');
                done();
            });
    });

    it('Проверка запросов для которых нужен токен. Токена неверный', (done) => {
        request(server)
            .get('/test/verify')
            .set('x-access-token', 'incorrect')
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error_code');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Failed to authenticate token');
                done();
            });
    });

    it('Проверка запросов для которых нужен токен. Токена верный', (done) => {
        request(server)
            .get('/test/verify')
            .set('x-access-token', token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Verify completed');
                done();
            });
    });
});

describe('CRUD операции', () => {
    let token = '';
    before((done) => {
        const user = {
            name: 'name',
            email: 'bla@bla.com',
            password: 'bla',
            passwordConfirm: 'bla'
        };

        request(server)
            .post('/register')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.token;
                done();
            });
    });

    after( async() => {
        await User.remove({});
        await Book.remove({});
    });

    describe('Добавление книги', () => {

        it('Добавление без имени', (done) => {
            const book = {
                name: '',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.equal('Name and author must be filled');
                    done();
                })
        });

        it('Добавление без автора', (done) => {
            const book = {
                name: 'first',
                author: '',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('error_code');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.equal('Name and author must be filled');
                    done();
                })
        });

        it('Корректное добавление', (done) => {
            const book = {
                name: 'first',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('author');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('genre');
                    done();
                })
        });
    });

    describe('Обновление книги', () => {
        let id = '';

        before((done) => {
            const book = {
                name: 'first',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        it('Обновление имени', (done) => {
            const newBook = {
                name: 'supername',
            };
            request(server)
                .put(`/books/${id}`)
                .send(newBook)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('author');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('genre');
                    expect(res.body.name).to.equal('supername');
                    done();
                });
        });

        it('Обновление автора', (done) => {
            const newBook = {
                author: 'superauthor',
            };
            request(server)
                .put(`/books/${id}`)
                .send(newBook)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('author');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('genre');
                    expect(res.body.author).to.equal('superauthor');
                    done();
                });
        });
    });

    describe('Статус книги: чтение', () => {
        let id = '';

        before((done) => {
            const book = {
                name: 'first individual',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        it('Установка статуса', (done) => {
            request(server)
                .post(`/books/${id}/read`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('read');
                    expect(res.body.read).to.equal(true);
                    done();
                });
        });

        it('Снятие статуса', (done) => {
            request(server)
                .post(`/books/${id}/read`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('read');
                    expect(res.body.read).to.equal(false);
                    done();
                });
        });
    });

    describe('Статус книги: фаворит', () => {
        let id = '';

        before((done) => {
            const book = {
                name: 'first individual',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        it('Установка статуса', (done) => {
            request(server)
                .post(`/books/${id}/vaforite`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('vaforite');
                    expect(res.body.vaforite).to.equal(true);
                    done();
                });
        });

        it('Снятие статуса', (done) => {
            request(server)
                .post(`/books/${id}/vaforite`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('vaforite');
                    expect(res.body.vaforite).to.equal(false);
                    done();
                });
        });
    });

    describe('Получение книг', () => {
        before(() => {
            stubs.books.forEach((f) => new Book(f).save().catch((e) => console.log(e)));
        });

        it('Проверка', (done) => {
            request(server)
                .get('/books')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('books');
                    expect(res.body.books).to.be.a('array');
                    expect(res.body.books.length).to.not.equal(0);
                    done();
                })
        });
    });

    describe('Получение книги по id' , () => {
        let id = '';

        const book = {
            name: 'first individual',
            author: 'iam',
            description: 'bla X100',
            genre: 'genre'
        };

        before((done) => {
            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        it('Проверка', (done) => {
           request(server)
               .get(`/books/${id}`)
               .expect(200)
               .end((err, res) => {
                   if (err) return done(err);
                   expect(res.body).to.have.property('name');
                   expect(res.body).to.have.property('author');
                   expect(res.body).to.have.property('description');
                   expect(res.body).to.have.property('genre');

                   expect(res.body.name).to.equal(book.name);
                   expect(res.body.author).to.equal(book.author);
                   expect(res.body.description).to.equal(book.description);
                   expect(res.body.genre).to.equal(book.genre);
                   done();
               })
        });
    });

    describe('Получение книг со статусом "чтение"', () => {
        let id = '';

        before((done) => {
            const book = {
                name: 'first individual',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        describe('Установка статуса для книги', () => {
           before((done) => {
               request(server)
                   .post(`/books/${id}/read`)
                   .set('x-access-token', token)
                   .expect(200)
                   .end((err, res) => {
                       done();
                   });
           });

           it('Получение', (done) => {
               request(server)
                   .get('/books/reads')
                   .set('x-access-token', token)
                   .expect(200)
                   .end((err, res) => {
                       if (err) return done(err);
                       expect(res.body).to.have.property('books');
                       expect(res.body.books).to.be.a('array');
                       expect(res.body.books).to.include(id);
                       expect(res.body.books.length).to.not.equal(0);
                       done();
                   })
           });

        });
    });

    describe('Получение книг со статусом "фаворит"', () => {
        let id = '';

        before((done) => {
            const book = {
                name: 'first individual',
                author: 'iam',
                description: 'bla X100',
                genre: 'genre'
            };

            request(server)
                .post('/books')
                .send(book)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    id = res.body._id;
                    done();
                })
        });

        describe('Установка статуса для книги', () => {
            before((done) => {
                request(server)
                    .post(`/books/${id}/vaforite`)
                    .set('x-access-token', token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('vaforite');
                        expect(res.body.vaforite).to.equal(true);
                        done();
                    });
            });

            it('Получение', (done) => {
                request(server)
                    .get('/books/favorites')
                    .set('x-access-token', token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('books');
                        expect(res.body.books).to.be.a('array');
                        expect(res.body.books).to.include(id);
                        expect(res.body.books.length).to.not.equal(0);
                        done();
                    })
            });

        });
    });

});
