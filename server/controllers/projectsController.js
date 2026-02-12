const { prisma } = require('../db/db')

// get all tasks
const getAllProjects = async (req, res) => {
    const projects = await prisma.project.findMany();

    if (!projects) {
        res.status(400).json({msg: 'No projects in database'});
    }

    res.status(200).json({projects});
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
    createProject
}