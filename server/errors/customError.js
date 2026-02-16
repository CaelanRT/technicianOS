const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
    constructor(message) {
        super(message)
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}


class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthenticatedError
}


