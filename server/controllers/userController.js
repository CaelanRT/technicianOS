const {prisma} = require('../db/db');
const {hashPassword, comparePassword} = require('../utils/hashPass');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/customError');
const {createJWT, createTokenUser, attachCookiesToRequest} = require('../utils/jwt');
const {StatusCodes} = require('http-status-codes')

// get all users
const getAllUsers = async (req, res) => {
    
    const users = await prisma.user.findMany();

    if (!users) {
        throw new NotFoundError('No users in database');
    }

    res.status(StatusCodes.OK).json({users});
}

// get single user
const getSingleUser = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        throw new BadRequestError('Missing Credentials');
    }

    id = Number.parseInt(id);

    if (Number.isNaN(id)) {
        throw new BadRequestError('Invalid ID. Please send a valid integer value');
    }

    const user = await prisma.user.findUnique({
        where :{
            id: id
        }
    })

    if (!user) {
        throw new NotFoundError(`No user found with id ${id}`);
    }

    res.status(StatusCodes.OK).json({user});
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Missing Credentials.');
    }

    // find user and check
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    // if no user, throw error
    if (!user) {
        throw new NotFoundError('Invalid Credentials');
    }

    // get password and check against hash
    const match = await comparePassword(password, user.password);

    if (!match) {
        throw new UnauthenticatedError('Invalid password');
    }

    const tokenUser = createTokenUser(user);

    attachCookiesToRequest(res, tokenUser);

    res.status(StatusCodes.OK).json({user});
    
}

// register user
const registerUser = async (req, res) => {
    const {name, email, password, type} = req.body;
    if (!name || !email || !password || !type) {
        throw new BadRequestError('Missing Credentials.');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            type: type
        }
    })

    if (!user) {
        throw new BadRequestError('Error creating user. Please try again.');
    }

    const tokenUser = createTokenUser(user);

    attachCookiesToRequest(res, tokenUser);

    // need to add JWT!!
    //const token = createJWT(user);

    res.status(StatusCodes.CREATED).json({user, msg: 'User Registered Successfully.'});
}

// logout user
const logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(StatusCodes.OK).json({msg: 'Successfully logged out'});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    registerUser,
    loginUser,
    logout
}
