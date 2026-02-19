const {BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong, please try again'
    }

    if (err.code === "P2025") {
        customError.statusCode = StatusCodes.NOT_FOUND;
        customError.msg = 'No project with that ID.';
    }

    return res.status(customError.statusCode).json({msg: customError.msg});

}

module.exports = errorHandler;
