const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'MyJWT123';

async function genHash(password) {
    return new Promise((res, rej) => {
        bcrypt.hash(password, 10, function(err, hash) {
            // Store hash in your password DB.
            if (err) {
                rej(err);
            } else {
                res(hash);
            }
        });
    })
};

async function comparePassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

function genToken(user) {
    const token = jwt.sign({
        email: user.email,
        userType: user.userType
    }, SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = { genHash, comparePassword, genToken };