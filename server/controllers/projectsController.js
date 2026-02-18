const { prisma } = require('../db/db');
const {BadRequestError} = require('../errors/customError');

// get all tasks
const getAllProjects = async (req, res) => {
    const projects = await prisma.project.findMany();

    if (!projects) {
        res.status(400).json({msg: 'No projects in database'});
    }

    res.status(200).json({projects});
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

    res.status(200).json({project});
}

const createProject = async (req, res) => {

    const {name, projectManagerId, technicianId} = req.body;

    if (!name || !projectManagerId || !technicianId) {
        res.status(400).json({msg: 'Please send all parameters'});
    }

    const project = await prisma.project.create({
        data: {
            name: name,
            projectManagerId: projectManagerId,
            technicianId: technicianId
        }
    })

    if (!project) {
        res.status(400).json({msg: 'Project could not be created'});
    }
    
    res.status(200).json({project});
}

module.exports = {
    getAllProjects,
    getSingleProject,
    createProject
}