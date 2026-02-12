const express = require('express');
const {getAllProjects, createProject} = require('../controllers/projectsController');

const router = express.Router();

router.route('/').get(getAllProjects).post(createProject);

module.exports = router;