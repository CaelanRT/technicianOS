const express = require('express');
const { getCurrentUser, getAllUsers, getSingleUser, updateUserInfo } = require('../controllers/userController');
const {authenticateUser} = require('../middleware/authentication');

const router = express.Router();

router.route('/users/me').get(authenticateUser, getCurrentUser);
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/users/:id').get(authenticateUser, getSingleUser);
router.route('/users/update-user').patch(authenticateUser, updateUserInfo);

module.exports = router;
