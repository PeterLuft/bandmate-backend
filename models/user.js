var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    firstname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    passwordConf: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}],
    parts: [{type: Schema.Types.ObjectId, ref: 'Part'}]
});

UserSchema.statics.authenticate = function(email, password, callback){
    this.findOne({email: email})
        .exec(function(err, user){
            if(err){
                return callback(err);
            }
            else if(!user){
                var err = new Error('User not found');
                err.status = 401;
                return callback(err);
            }

            bcrypt.compare(password, user.password, function(err, result){
                if(result == true){
                    return callback(null, user);
                }
                else{
                    return callback();
                }
            });

        })
}


UserSchema.pre('save', function(next){
   var user = this;

   bcrypt.hash(user.password, 10, function(err, hash){
       if(err){
           return next(err);
       }
       user.password = hash;
       next();
   })
});




module.exports = mongoose.model('User', UserSchema);