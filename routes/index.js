const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');

router.post('/register', userController.register, authController.login);
router.post('/auth', authController.login);
router.get('/books', bookController.getBooks); // TODO проверка параметров, чтобы лишние нельзя было передать

module.exports = router;