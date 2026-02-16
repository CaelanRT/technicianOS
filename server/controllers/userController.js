const {prisma} = require('../db/db');
const {hashPassword, comparePassword} = require('../utils/hashPass');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/customError');

// get all users
const getAllUsers = async (req, res) => {
    
    const users = await prisma.user.findMany();

    if (!users) {
        throw new NotFoundError('No users in database');
    }

    res.status(200).json({users});
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

    if (!user) {
        throw new NotFoundError('Invalid Credentials');
    }

    // get password and check against hash
    const match = await comparePassword(password, user.password);

    if (!match) {
        throw new UnauthenticatedError('Invalid password');
    }

    // need to add JWT!!

    res.status(200).json({user});
    
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

    // need to add JWT!!

    res.status(200).json({user});
}

module.exports = {
    getAllUsers,
    registerUser,
    loginUser
}
