const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors/customError');

const authenticateUser = (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: payload.userId
        }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
}

module.exports = authenticateUser;