const express = require('express');
const {getAllProjects, createProject} = require('../controllers/projectsController');
const {getAllUsers, registerUser} = require('../controllers/userController');

const router = express.Router();

router.route('/projects').get(getAllProjects).post(createProject);
router.route('/users').get(getAllUsers).post(registerUser);
module.exports = router;