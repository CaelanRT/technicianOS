const {prisma} = require('../db/db');

// get all users
const getAllUsers = (req, res) => {
    res.send('get all users');
}
// register user
const registerUser = async (req, res) => {
    const {name, email, password, type} = req.body;
    if (!name || !email || !password || !type) {
        res.status(400).json({msg: 'Missing parameters, please send all parameters.'});
    }

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
            type: type
        }
    })

    if (!user) {
        res.status(400).json({msg:'Error creating user'})
    }

    res.status(200).json({user});
}

module.exports = {
    getAllUsers,
    registerUser
}
