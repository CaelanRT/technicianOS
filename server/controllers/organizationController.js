const {StatusCodes} = require('http-status-codes');
const {prisma} = require('../db/db');
const {BadRequestError, NotFoundError} = require('../errors/customError');

// get single org
const getSingleOrg = async (req, res) => {
    let orgId = req.params.id;

    if (!orgId) {
        throw new BadRequestError('Invalid request. Please send an ID.');
    }

    orgId = Number.parseInt(orgId);

    if (Number.isNaN(orgId)) {
        throw new BadRequestError('Invalid request. Please send an integer value');
    }
    
    const organization = await prisma.organization.findUnique({
        where: {
            id: orgId
        }
    })

    if (!organization) {
        throw new NotFoundError(`No organization with ${orgId} found.`);
    }

    res.status(StatusCodes.OK).json({organization});
}

// get all orgs
const getAllOrgs = async (req, res) => {
    const orgs = await prisma.organization.findMany();

    if (!orgs) {
        throw new NotFoundError('No Orgs in DB.');
    }

    res.status(StatusCodes.OK).json({orgs});
}

// create org
const createOrg = async (req, res) => {
    const {name} = req.body;

    if (!name) {
        throw new BadRequestError('Invalid request. Please send with a name');
    }

    const organization = await prisma.organization.create({
        data: {
            name: name
        }
    })

    res.status(StatusCodes.CREATED).json({organization});
}

// update org
const updateOrg = async (req, res) => {
    const name = req.body;

    if (!body) {
        throw new BadRequestError('Invalid request. Please send with a name');
    }

    let orgId = req.params.id;

    if (!orgId) {
        throw new BadRequestError('Invalid request. Please add an ID.');
    }

    orgId = Number.parseInt(orgId);

    if (Number.isNaN(orgId)) {
        throw new BadRequestError('Invalid request. Please enter an integer value for ID');
    }

    const organization = await prisma.organization.update({
        where: {
            id: orgId
        },
        data:{
            name: name
        }
    })

    res.status(StatusCodes.OK).json({organization, msg:"Organization updated successfully."});
}

// delete org

//export
module.exports = {
    getSingleOrg,
    getAllOrgs,
    createOrg,
    updateOrg
}