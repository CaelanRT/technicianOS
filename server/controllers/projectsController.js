const { STATUS_CODES } = require('node:http');
const { prisma } = require('../db/db');
const {BadRequestError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');

// get all Projects
const getAllProjects = async (req, res) => {
    const projects = await prisma.project.findMany();

    if (!projects) {
        throw new BadRequestError('No Projects in database.')
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
        throw new BadRequestError(`No Project with ID ${id}`);
    }

    res.status(StatusCodes.OK).json({project});
}

// create project
const createProject = async (req, res) => {

    const {name, projectManagerId, technicianId} = req.body;

    if (!name || !projectManagerId || !technicianId) {
        throw new BadRequestError('Missing parameters.')
    }

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
    
    res.status(StatusCodes.OK).json({project});
}

// update project
const updateProject = (req, res) => {
    res.status(StatusCodes.OK).json({msg:'updateProject'});
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

    // may need to check if the project is in the DB first then delete it

    const project = await prisma.project.delete({
        where : {
            id: id
        }
    })

    if (!project) {
        throw new BadRequestError('No project with that ID');
    }

    res.status(StatusCodes.OK).json({project});
}

module.exports = {
    getAllProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject
}