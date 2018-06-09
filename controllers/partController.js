var Part = require('../models/part');
var User = require('../models/user');
var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.part_list = function(req, res, next) {
    Part.find({}, 'name description')
        .populate('user')
        .exec(function(err, list_parts){
            if(err){
                return next(err);
            }
            res.send(list_parts);
        })
};

exports.part_create = [
    body('name', 'Name must not be empty.').isLength({min: 1}).trim(),
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var part = new Part(
            {
                name: req.body.name,
                description: req.body.description
            }
        )

        if(!errors.isEmpty()){
            async.parallel({
                users: function(callback){
                    User.find(callback);
                },
            }, function(err, results){
                res.send({
                    title: 'Create part', users: results.users, part: part, errors: errors.array()
                });
            });
            return;
        }
        else{
            part.save(function(err){
                if(err){
                    return next(err);
                }
                res.send(part);
            });
        }
    }
];


exports.part_detail = function(req, res, next) {
    //implement part detail here
};



exports.part_delete = function(req, res, next) {
    //implement part deletion here

    console.log(req.param.id);


};

exports.part_update = [
    body('name', 'Name must not be empty').isLength({min: 1}).trim(),

    sanitizeBody('title').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var toUpdate = {
            name: req.body.name,
            description: req.body.description
        };

        if(!errors.isEmpty()){
            res.send({
                title: 'Update part',
                errors: errors.array()
            });
        }
        else{
            Part.findByIdAndUpdate(req.params.id, toUpdate, {new: true}, function(err, updatedPart){
               if(err){
                   return next(err);
               }
               res.send(updatedPart);
            });
        }


    }

];



