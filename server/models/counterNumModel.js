const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const counterNoSchema = new Schema({
    
    id: {
        type: String,
    },
    sequenceNo: {
        type: Number,
    }
    
}, {timestamps: true});
var CounterNoModel = mongoose.model('counterNumber', counterNoSchema);
module.exports = CounterNoModel;