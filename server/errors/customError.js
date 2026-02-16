const {statusCodes} = require('http-status-codes');

class CustomError extends Error {
    constructor(message) {
        super(message)
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.NOT_FOUND;
    }
}


class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.BAD_REQUEST;
    }
}

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes.UNAUTHORIZED;
    }
}

module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthenticatedError
}


