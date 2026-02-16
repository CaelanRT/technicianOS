const jwt = require('jsonwebtoken');

const createJWT = function (user) {
    return jwt.sign({
        UserId: user.UserId,
        name: user.name
    },process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_LIFETIME
    }
    )
}

module.exports = createJWT;