var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = require('../config')


exports.createJWT = function (details) {

    if (typeof details !== 'object') {
        details = {};
    }
    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600;
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val;
        }
        return memo;
    }, {});

    var token = jwt.sign(
        {
            data: details.sessionData
        },
        config.JWT_SECRET,
        {
            expiresIn: details.maxAge,
            algorithm: 'HS256'
        }
    );
    return token;
};

exports.verifyJWT = function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }
            resolve(decodedToken);
        });
    });
};