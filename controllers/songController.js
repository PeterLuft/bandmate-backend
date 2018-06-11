var Song = require('../models/song');
var User = require('../models/user');

var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

//get all songs
exports.song_list = function (req, res, next) {

    //get all songs for this user

    var user = req.user._doc._id;

    console.log(user);

    Song.find({}, 'title parts')
        .populate('user')
        .exec(function (err, list_songs) {
            if (err) {
                return next(err);
            }
            res.send(list_songs);
        })
};

exports.song_create = [
    body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
    // body('user', 'User must not be empty.').isLength({min: 1}).trim(),
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var user = req.user._doc._id;

        var song = new Song(
            {
                title: req.body.title,
                user: user,
                parts: []
            }
        )

        if (!errors.isEmpty()) {
            async.parallel({
                users: function (callback) {
                    User.find(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }
                res.send({
                    title: 'Create song', users: results.users, song: song, errors: errors.array()
                });
            });
            return;
        }
        else {
            song.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send(song);
            })
        }
    }
];

exports.song_detail = function (req, res, next) {
    async.parallel({
        song: function (callback) {
            Song.findById(req.params.id)
                 .populate('user')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.song == null) {
            //no results
            var err = new Error('Song not found');
            err.status = 404;
            return next(err);
        }
        res.send(
            results.song
        );
    });
};

exports.song_delete = function (req, res) {

    async.parallel({
        //may need for implementation here
    }, function(err, results){
        Song.findByIdAndRemove(req.params.id, function deleteSong(err){
            if(err){
                return next(err);
            }
            res.send({
                message: 'successfully deleted',
                id: req.params.id
            })
        })

    })

};

exports.song_update = [
    body('title', 'Title must not be empty').isLength({ min: 1}).trim(),
    // body('user', 'User must not be empty').isLength({min: 1}).trim(),

    sanitizeBody('title').trim().escape(),
    // sanitizeBody('user').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var toUpdate =
            {
                title: req.body.title,
                parts: req.body.parts
            };

        if(!errors.isEmpty()){
            res.send({
                title: 'Update song',
                errors: errors.array()
            });
        }
        else{
            Song.findByIdAndUpdate(req.params.id,  toUpdate, {new: true}, function(err, updatedSong){
                if(err){
                    return next(err);
                }
                res.send(updatedSong)
            });
        }

    }
];





