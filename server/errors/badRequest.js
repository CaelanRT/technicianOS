const CustomError = require('./customError');
const {statusCodes} = require('http-status-codes');

class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;