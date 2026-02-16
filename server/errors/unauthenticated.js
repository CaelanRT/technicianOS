const CustomError = require('./customError');
const {statusCodes} = require('http-status-codes');

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;