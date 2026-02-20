const express = require('express');
const {getAllProjects, getSingleProject, createProject, updateProject, deleteProject} = require('../controllers/projectsController');
const {getAllUsers, getSingleUser, registerUser, loginUser, logout} = require('../controllers/userController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.route('/projects').get(authenticateUser, getAllProjects).post(authenticateUser, createProject);
router.route('/projects/:id').get(authenticateUser, getSingleProject).patch(authenticateUser, updateProject).delete(authenticateUser, deleteProject);
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/users/:id').get(authenticateUser, getSingleUser);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);

module.exports = router;