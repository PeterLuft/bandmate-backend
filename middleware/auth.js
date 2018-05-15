var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function(req, res, next){

    if(req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')){
        try{
            //try to decode and verify it's a JWT token
            req.user = jwt.verify(req.headers['authorization'], config.JWT_SECRET);
        }
        catch(err){
            //if the authorization header is corrupted, throw exception
            return res.status(401).json({
                error: {
                    message: 'Failed to authenticate token'
                }
            });
        }
    }
    else{
        //if there is no authorization header, return 401 error
        return res.status(401).json({
            error: {
                message: 'No token'
            }
        });
    }
    next();
    return;
};