const {generateToken} = require('../middleware/auth');

function authUser(email, password){
    try{
        const token = generateToken(email, password);
        return token;

    }catch(err){
        console.log(err.message);
    }
}

module.exports = { authUser };