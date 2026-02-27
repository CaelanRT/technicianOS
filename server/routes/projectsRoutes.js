const express = require('express');
const {
    getAllProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectsController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.route('/projects').get(authenticateUser, getAllProjects).post(authenticateUser, createProject);
router
    .route('/projects/:id')
    .get(authenticateUser, getSingleProject)
    .patch(authenticateUser, updateProject)
    .delete(authenticateUser, deleteProject);

module.exports = router;
