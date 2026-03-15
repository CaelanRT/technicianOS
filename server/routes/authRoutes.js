const express = require('express');
const { registerUser, registerWithOrg, loginUser, logout } = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/register-with-org').post(registerWithOrg);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);

module.exports = router;
