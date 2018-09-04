const express = require('express');
//const bcrypt = require('bcrypt-nodejs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

const router = express.Router();
const UserController = require('../controllers/users');

router.post("/signup" , UserController.createUser);

router.post('/login', UserController.loginUser);


// export the router
module.exports = router;
