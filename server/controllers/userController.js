const {prisma} = require('../db/db');
const {hashPassword, comparePassword} = require('../utils/hashPass');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/customError');
const {createJWT, createTokenUser, attachCookiesToRequest} = require('../utils/jwt');
const {StatusCodes} = require('http-status-codes')

const VALID_USER_ROLES = ['project_manager', 'technician'];

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

// login user
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
    const {name, email, password, role, organizationId} = req.body;
    if (!name || !email || !password || !role || !organizationId) {
        
        throw new BadRequestError('Missing Credentials.');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            organizationId: organizationId
        }
    })

    if (!user) {
        throw new BadRequestError('Error creating user. Please try again.');
    }

    const tokenUser = createTokenUser(user);

    attachCookiesToRequest(res, tokenUser);


    res.status(StatusCodes.CREATED).json({user, msg: 'User Registered Successfully.'});
}

// edit user
const updateUserInfo = async (req, res) => {
    const {name, email, role} = req.body;

    if (!name || !email || !role) {
        throw new BadRequestError('Missing Credentials. name, email and role are required.');
    }

    if (!VALID_USER_ROLES.includes(role)) {
        throw new BadRequestError(`Invalid role. Must be one of: ${VALID_USER_ROLES.join(', ')}`);
    }

    const userId = req.user?.userId;

    if (!userId) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!existingUser) {
        throw new NotFoundError(`No user found with id ${userId}`);
    }

    const duplicateEmailUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (duplicateEmailUser && duplicateEmailUser.id !== userId) {
        throw new BadRequestError('Email already in use.');
    }

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name: name,
            email: email,
            role: role
        }
    })

    res.status(StatusCodes.OK).json({user, msg: 'User info updated successfully.'});
}

// edit user password - need to rehash!

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
    updateUserInfo,
    logout
}
