const { prisma } = require('../db/db');
const { BadRequestError, NotFoundError } = require('../errors/customError');
const { StatusCodes } = require('http-status-codes');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

// get all Tasks
const getAllTasks = async (req, res) => {
    const tasks = await prisma.task.findMany();

    if (!tasks) {
        throw new NotFoundError('No Tasks in database.');
    }

    res.status(StatusCodes.OK).json({ tasks });
};

// get single task
const getSingleTask = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID.');
    }

    id = Number.parseInt(id);

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.');
    }

    const task = await prisma.task.findUnique({
        where: {
            id: id,
        },
    });

    if (!task) {
        throw new NotFoundError(`No Task with ID ${id}`);
    }

    res.status(StatusCodes.OK).json({ task });
};

// create task
const createTask = async (req, res) => {
    const { name, description, projectId, status, assignedToUserId } = req.body;

    if (!name || !description || !projectId) {
        throw new BadRequestError('Missing parameters.');
    }

    if (status && !VALID_STATUSES.includes(status)) {
        throw new BadRequestError(
            `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
        );
    }

    const data = {
        name,
        description,
        projectId,
    };

    if (status) {
        data.status = status;
    }
    if (assignedToUserId !== undefined) {
        data.assignedToUserId = assignedToUserId;
    }

    const task = await prisma.task.create({
        data,
    });

    if (!task) {
        throw new BadRequestError('Task could not be created');
    }

    res.status(StatusCodes.CREATED).json({ task });
};

// update task
const updateTask = async (req, res) => {
    const { name, description, projectId, status, assignedToUserId } =
        req.body;

    if (!name || !description || !projectId || status == null || assignedToUserId === undefined) {
        throw new BadRequestError('Missing arguments');
    }

    if (!VALID_STATUSES.includes(status)) {
        throw new BadRequestError(
            `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
        );
    }

    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID');
    }

    id = Number.parseInt(id);

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.');
    }

    const task = await prisma.task.update({
        where: {
            id: id,
        },
        data: {
            name,
            description,
            projectId,
            status,
            assignedToUserId,
        },
    });

    res.status(StatusCodes.OK).json({ task });
};

// delete task
const deleteTask = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID.');
    }

    id = Number.parseInt(id);

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.');
    }

    const task = await prisma.task.delete({
        where: {
            id: id,
        },
    });

    res.status(StatusCodes.OK).json({ task });
};

module.exports = {
    getAllTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask,
};
