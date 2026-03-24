const { prisma } = require('../db/db');
const {BadRequestError, NotFoundError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');
const {authenticateTenant} = require('../middleware/authentication');

// get all Projects
const getAllProjects = async (req, res) => {
    const projects = await prisma.project.findMany();

    if (!projects) {
        throw new NotFoundError('No Projects in database.')
    }

    res.status(StatusCodes.OK).json({projects});
}

const getAssignedProjects = async (req, res) => {

    const {userId, orgId, role} = req.user;

    if (!userId || !orgId || !role) {
        throw new BadRequestError('Missing arguments');
    }

    if(role === 'project_manager') {
        

        const projects = await prisma.project.findMany({
            where: {
                projectManagerId: userId,
                organizationId: orgId
            },
            include:{
                tasks: true
            }
        })

        // make sure there are projects else throw
        if (!projects) {
            throw new NotFoundError('No projects yet.')
        }
        // return the projects
        res.status(StatusCodes.OK).json({projects});
    }

    // same for technician
    if(role === 'technician') {
        
        // fetch stuff
        const projects = await prisma.project.findMany({
            where: {
                technicianId: userId,
                organizationId: orgId
            },
            include:{
                tasks: true
            }
        })

        // make sure there are projects else throw
        if (!projects) {
            throw new NotFoundError('No projects yet.')
        }
        // return the projects
        res.status(StatusCodes.OK).json({projects});
    }
    
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

    authenticateTenant(req.user, project.organizationId);

    res.status(StatusCodes.OK).json({project});
}

// create project
const createProject = async (req, res) => {

    const {name, organizationId, projectManagerId, technicianId} = req.body;

    if (!name || !organizationId || !projectManagerId || !technicianId) {
        throw new BadRequestError('Missing parameters.')
    }

    authenticateTenant(req.user, organizationId);

    const project = await prisma.project.create({
        data: {
            name: name,
            organizationId: organizationId,
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
    const {name, organizationId, projectManagerId, technicianId} = req.body;

    if (!name || !organizationId || !projectManagerId || !technicianId) {
        throw new BadRequestError('Missing arguments');
    }

    authenticateTenant(req.user, organizationId);

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
            organizationId: organizationId,
            projectManagerId: projectManagerId,
            technicianId: technicianId
        }
    })
    
    res.status(StatusCodes.OK).json({project});
}

// delete project
const deleteProject = async (req, res) => {
    const {orgId} = req.body;

    if (!orgId) {
        throw new BadRequestError('Missing arguments');
    }

    authenticateTenant(req.user, orgId);

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
    deleteProject,
    getAssignedProjects
}