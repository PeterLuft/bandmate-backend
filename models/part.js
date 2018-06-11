var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PartSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        description: {type: String, max: 100},
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    }
);

module.exports = mongoose.model('Part', PartSchema);