const {prisma} = require('../db/db');
const {hashPassword, comparePassword} = require('../utils/hashPass');

// get all users
const getAllUsers = async (req, res) => {
    
    const users = await prisma.user.findMany();

    if (!users) {
        res.status(400).json({msg: 'No users in database'});
    }

    res.status(200).json({users});
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).json({msg: 'Missing parameters, please send all parameters.'});
    }

    // find user and check
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        res.status(400).json({msg: 'No user found.'});
    }

    // get password and check against hash
    const match = await comparePassword(password, user.password);

    if (!match) {
        res.status(400).json({msg:'Invalid password'});
    }

    // need to add JWT!!

    res.status(200).json({user});
    
}

// register user
const registerUser = async (req, res) => {
    const {name, email, password, type} = req.body;
    if (!name || !email || !password || !type) {
        res.status(400).json({msg: 'Missing parameters, please send all parameters.'});
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
        res.status(400).json({msg:'Error creating user'})
    }

    // need to add JWT!!

    res.status(200).json({user});
}

module.exports = {
    getAllUsers,
    registerUser,
    loginUser
}
