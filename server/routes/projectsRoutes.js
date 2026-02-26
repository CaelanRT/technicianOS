const express = require('express');
const {getAllProjects, getSingleProject, createProject, updateProject, deleteProject} = require('../controllers/projectsController');
const {getAllUsers, getSingleUser, registerUser, loginUser, updateUserInfo, logout} = require('../controllers/userController');
const {getSingleOrg, createOrg, getAllOrgs, updateOrg, deleteOrg} = require('../controllers/organizationController');
const {getAllTasks, getSingleTask, createTask, updateTask, deleteTask} = require('../controllers/taskController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

// projects
router.route('/projects').get(authenticateUser, getAllProjects).post(authenticateUser, createProject);
router.route('/projects/:id').get(authenticateUser, getSingleProject).patch(authenticateUser, updateProject).delete(authenticateUser, deleteProject);

// tasks
router.route('/tasks').get(authenticateUser, getAllTasks).post(authenticateUser, createTask);
router.route('/tasks/:id').get(authenticateUser, getSingleTask).patch(authenticateUser, updateTask).delete(authenticateUser, deleteTask);

// users
router.route('/users').get(authenticateUser, getAllUsers);
router.route('/users/:id').get(authenticateUser, getSingleUser);
router.route('/users/update-user').patch(authenticateUser, updateUserInfo);

// organizations
router.route('/organizations').post(authenticateUser, createOrg).get(authenticateUser, getAllOrgs);
router.route('/organizations/:id').get(authenticateUser, getSingleOrg).patch(authenticateUser, updateOrg).delete(authenticateUser, deleteOrg);

// auth
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);

module.exports = router;
