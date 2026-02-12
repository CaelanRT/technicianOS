require('dotenv').config();
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

const comparePassword = async (candidatePassword, hash) => {
    const isMatch = await bcrypt.compare(candidatePassword, hash);
    return isMatch;
}

module.exports = {
    hashPassword,
    comparePassword
};