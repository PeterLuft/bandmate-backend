var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    date_joined: {type: Date},
});

UserSchema
.virtual('name')
.get(function() {
    return this.last_name + ', ' + this.first_name;
});

UserSchema
.virtual('url')
.get(function() {
   return '/users/' + this._id
});

module.exports = mongoose.model('User', UserSchema);