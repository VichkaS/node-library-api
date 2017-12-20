const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/register', userController.register, authController.login);
router.post('/auth', authController.login);

module.exports = router;