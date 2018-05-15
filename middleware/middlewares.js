var auth = require('../authorization/auth');

exports.verify_JWT_MW = function(req, res, next){
    var token = req.get('Authorization');

    auth.verifyJWT(token)
        .then((decodedToken) => {
            req.user = decodedToken.data;
            next();
        })
        .catch((err) => {
            res.status(400)
                .json({message: "Invalid auth token provided"});
        });
}