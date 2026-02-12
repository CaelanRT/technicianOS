const { prisma } = require('../db/db')

// get all tasks
const getAllProjects = (req, res) => {
    res.send('getAllProjects');
}

const createProject = (req, res) => {


    res.send('create project');
}

module.exports = {
    getAllProjects,
    createProject
}