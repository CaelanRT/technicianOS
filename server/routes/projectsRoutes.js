const express = require('express');
const getAllProjects = require('../controllers/projectsController');

const router = express.Router();

router.route('/').get(getAllProjects);

module.exports = router;