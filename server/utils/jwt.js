const jwt = require('jsonwebtoken');

const createTokenUser = (user) => {
    
    return tokenUser = {
        userId: user.id,
        name: user.name
    }
}

const createJWT = function (tokenUser) {

    return jwt.sign(tokenUser, process.env.JWT_SECRET,
        {
        expiresIn: process.env.JWT_LIFETIME
        });
}

const attachCookiesToRequest = (res, tokenUser) => {
    const token = createJWT(tokenUser);

    const oneDay = 1000 * 60 * 60 * 24;

    return res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })


}

module.exports = {
    createTokenUser,
    createJWT,
    attachCookiesToRequest
};