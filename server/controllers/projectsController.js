const { STATUS_CODES } = require('node:http');
const { prisma } = require('../db/db');
const {BadRequestError, NotFoundError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');

// get all Projects
const getAllProjects = async (req, res) => {
    const projects = await prisma.project.findMany();

    if (!projects) {
        throw new NotFoundError('No Projects in database.')
    }

    res.status(StatusCodes.OK).json({projects});
}

// get single project
const getSingleProject = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID.')
    }

    id = Number.parseInt(id)

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.');
    }

    const project = await prisma.project.findUnique({
        where: {
            id: id
        }
    })

    if (!project) {
        throw new NotFoundError(`No Project with ID ${id}`);
    }

    res.status(StatusCodes.OK).json({project});
}

// create project
const createProject = async (req, res) => {

    const {name, projectManagerId, technicianId} = req.body;

    if (!name || !projectManagerId || !technicianId) {
        throw new BadRequestError('Missing parameters.')
    }

    // check for ints for ids!

    const project = await prisma.project.create({
        data: {
            name: name,
            projectManagerId: projectManagerId,
            technicianId: technicianId
        }
    })

    if (!project) {
        throw new BadRequestError('Project could not be created');
    }
    
    res.status(StatusCodes.CREATED).json({project});
}

// update project
const updateProject = async (req, res) => {
    const {name, projectManagerId, technicianId} = req.body;

    if (!name || !projectManagerId || !technicianId) {
        throw new BadRequestError('Missing arguments');
    }

    // check for ints for ids!

    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID');
    }

    id = Number.parseInt(id);

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.')
    }

    const project = await prisma.project.update({
        where: {
            id: id
        },
        data: {
            name: name,
            projectManagerId: projectManagerId,
            technicianId: technicianId
        }
    })
    
    res.status(StatusCodes.OK).json({project});
}

// delete project
const deleteProject = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing ID. Please send with an ID.')
    }

    id = Number.parseInt(id)

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send an integer value.');
    }

    const project = await prisma.project.delete({
        where : {
            id: id
        }
    })

    // set this to a 204 and don't send a payload for production
    res.status(StatusCodes.OK).json({project});
}

module.exports = {
    getAllProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject
}