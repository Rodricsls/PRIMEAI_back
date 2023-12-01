const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.TOKEN_KEY;

//Function to generate a token with the user mail
function generateToken(email, password){
    const payload = {
        email: email,
        password: password
    };
    const options = {
        expiresIn: '1w'// the token will expires in 1 week
    };
    return jwt.sign(payload, key, options);

}

//Function to verify the token
function verifyToken(token){
    try{
        return jwt.verify(token, key);
    }catch(err){
        return false;//if the token is invalid
    }
}

module.exports = { generateToken, verifyToken };