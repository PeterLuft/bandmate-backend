var User = require('../models/user');
var Song = require('../models/song');
var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

//display list of all users
exports.user_list = function (req, res, next) {
    User.find()
        .sort([['last_name', 'ascending']])
        .exec(function (err, list_users) {
            if (err) {
                return next(err);
            }
            res.send({
                title: 'User List',
                users: list_users
            });
        })
};

exports.user_detail = function (req, res, next) {
    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback);
        },
        user_songs: function (callback) {
            Song.find({'user': req.params.id}, 'title parts')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.user == null) {
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.send({
            title: 'User detail',
            user: results.user,
            user_songs: results.user_songs
        })
    });
};

exports.user_create = [
    // body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.')
    //     .isAlphanumeric().withMessage('First name has invalid characters'),
    // body('last_name').isLength({min: 1}).trim().withMessage('Last name must be specified.')
    //     .isAlphanumeric().withMessage('Last name has invalid characters'),
    // body('email').isLength({min: 1}).trim().withMessage('Email must be specified.'),
    //
    // sanitizeBody('first_name').trim().escape(),
    // sanitizeBody('last_name').trim().escape(),
    // sanitizeBody('email').trim().escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.send(
                {
                    title: 'Create User',
                    user: req.body,
                    errors: errors.array()
                }
            );
            return;
        }
        else {
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConf
            };

            User.create(userData, function(err, user){
                if(err){
                    return next(err);
                }
                else{
                    res.send({
                        title: 'User created'
                    })
                }
            })
        }
    }

];


exports.user_delete = function (req, res, next) {
    aysnc.parallel({
        user: function (callback) {
            User.findById(req.body.userId).exec(callback)
        },
        user_songs: function (callback) {
            Song.find({'user': req.body.userId}).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        User.findByIdAndRemove(req.body.userId, function deleteUser(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/users');
        })
    });
};


exports.user_update = function (req, res) {
    res.send('NOT IMPLEMENTED: user update POST');
};