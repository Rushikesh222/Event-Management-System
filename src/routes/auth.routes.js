const express = require('express');

const router = express.Router();

const { userRegisterController,userLoginController,  } = require('../controllers/auth.controller');

// Register route
router.post('/register', userRegisterController);

// Login route
router.post('/login', userLoginController);


module.exports = router;

