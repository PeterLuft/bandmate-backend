var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PartSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        description: {type: String, max: 100}
        //TODO: add user relationship
    }
);

module.exports = mongoose.model('Part', PartSchema);