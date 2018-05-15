var User = require('../models/user');

const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');

exports.login = function(req, res, next){

    User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){
        if(error || !user){
            //error in authentication
            var err = new Error('Wrong email or password');
            err.status = 401;
            return next(err);
        }
        else{
            req.session.userId = user._id;
            res.send({
                title: 'Successful authentication',
                user: user

            })
        }
    });


};