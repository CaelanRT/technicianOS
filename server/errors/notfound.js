const CustomError = require('./customError');
const {statusCodes} = require('http-status-codes');

class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;