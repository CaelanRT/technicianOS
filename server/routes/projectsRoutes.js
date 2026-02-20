const express = require('express');
const {getAllProjects, getSingleProject, createProject, updateProject, deleteProject} = require('../controllers/projectsController');
const {getAllUsers, registerUser, loginUser, logout} = require('../controllers/userController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.route('/projects').get(getAllProjects).post(createProject);
router.route('/projects/:id').get(getSingleProject).patch(updateProject).delete(deleteProject);
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);

module.exports = router;