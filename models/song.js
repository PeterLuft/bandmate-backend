var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SongSchema = new Schema(
    {
        title: {type: String, required: true, max: 100},
        // user: {type: Schema.ObjectId, ref: 'User', required: true, max: 100},
        parts: {type: Array, "default": []}
    }
);

SongSchema
.virtual('url')
.get(function () {
    return '/song/' + this._id;
});

module.exports = mongoose.model('Song', SongSchema);