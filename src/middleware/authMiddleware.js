const {verifyToken}=require('./auth');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);//if there is no token
    if(verifyToken(token)){
        next();//if the token is valid
    }else{
        return res.sendStatus(403);//if the token is invalid
    }
}

module.exports = { authenticateToken };