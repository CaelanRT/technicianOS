const {BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong, please try again'
    }

    return res.status(customError.statusCode).json({msg: customError.msg});

}

module.exports = errorHandler;
