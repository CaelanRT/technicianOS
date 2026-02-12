const express = require('express');
const {getAllProjects, createProject} = require('../controllers/projectsController');
const {getAllUsers, registerUser, loginUser} = require('../controllers/userController');

const router = express.Router();

router.route('/projects').get(getAllProjects).post(createProject);
router.route('/users').get(getAllUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
module.exports = router;