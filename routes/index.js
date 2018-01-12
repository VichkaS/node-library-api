const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');

router.post('/register', authController.validateRegister, userController.register, authController.login);
router.post('/auth', authController.login);

router.post('/books',authController.verifyToken, bookController.validateAdding, bookController.addBook);
router.get('/books', bookController.getBooks);
router.get('/books/reads', authController.verifyToken, bookController.getReadsBooks);
router.get('/books/favorites', authController.verifyToken, bookController.getFavoritesBooks);
router.get('/books/:id', bookController.getBookById);
router.put('/books/:id', authController.verifyToken, bookController.updateBook);

router.post('/books/:id/read', authController.verifyToken, bookController.setReadBook);
router.post('/books/:id/vaforite', authController.verifyToken, bookController.setFavoriteBook);

router.get('/test/verify', authController.verifyToken, authController.stubForVerifyToken);

module.exports = router;