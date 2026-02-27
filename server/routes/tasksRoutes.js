const express = require('express');
const {
    getAllTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.route('/tasks').get(authenticateUser, getAllTasks).post(authenticateUser, createTask);
router
    .route('/tasks/:id')
    .get(authenticateUser, getSingleTask)
    .patch(authenticateUser, updateTask)
    .delete(authenticateUser, deleteTask);

module.exports = router;
