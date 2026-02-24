const express = require('express');
const {getAllProjects, getSingleProject, createProject, updateProject, deleteProject} = require('../controllers/projectsController');
const {getAllUsers, getSingleUser, registerUser, loginUser, logout} = require('../controllers/userController');
const {getSingleOrg, createOrg, getAllOrgs, updateOrg, deleteOrg} = require('../controllers/organizationController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

// projects
router.route('/projects').get(authenticateUser, getAllProjects).post(authenticateUser, createProject);
router.route('/projects/:id').get(authenticateUser, getSingleProject).patch(authenticateUser, updateProject).delete(authenticateUser, deleteProject);

// users
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/users/:id').get(authenticateUser, getSingleUser);

// organizations
router.route('/organizations').post(createOrg).get(getAllOrgs);
router.route('/organizations/:id').get(getSingleOrg).patch(updateOrg).delete(deleteOrg);

// auth
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);

module.exports = router;