const express = require('express');
const {getAllProjects, getSingleProject, createProject} = require('../controllers/projectsController');
const {getAllUsers, registerUser, loginUser} = require('../controllers/userController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.route('/projects').get(getAllProjects).post(createProject);
router.route('/projects/:id').get(getSingleProject);
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
module.exports = router;