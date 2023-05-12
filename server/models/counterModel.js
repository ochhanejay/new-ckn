const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const counterSchema = new Schema({
    
    id: {
        type: String,
    },
    sequence: {
        type: Number,
    }
    
}, {timestamps: true});
var CounterModel = mongoose.model('counter', counterSchema);
module.exports = CounterModel;