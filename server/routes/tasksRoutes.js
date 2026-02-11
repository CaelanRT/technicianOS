const express = require('express');
const getAllTasks = require('../controllers/tasksController');

const router = express.Router();

router.route('/').get(getAllTasks);

module.exports = router;