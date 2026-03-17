const jwt = require('jsonwebtoken');
const {UnauthenticatedError, ForbiddenError, BadRequestError} = require('../errors/customError');


const authenticateUser = (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: payload.userId,
            orgId: payload.orgId,
            role: payload.role
        }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
}

const authenticateTenant = (reqUser, resourceOrgID) => {

    if (reqUser.orgId === resourceOrgID) return;
    
    throw new ForbiddenError('Access Denied');
    
}

const authenticateProject = (reqUser, resourceOrgID) => {

    // check 
    if (reqUser.orgId === resourceOrgID) return;

    throw new ForbiddenError('Access Denied');
}

module.exports = {authenticateUser, authenticateTenant, authenticateProject};