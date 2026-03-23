const express = require('express');
const { getCurrentUser, getAllUsers, getSingleUser } = require('../controllers/userController');
const {authenticateUser} = require('../middleware/authentication');

const router = express.Router();

router.route('/users/me').get(authenticateUser, getCurrentUser);
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/users/:id').get(authenticateUser, getSingleUser);

module.exports = router;
