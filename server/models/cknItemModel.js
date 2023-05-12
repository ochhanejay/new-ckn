const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const cknItemSchema = new Schema({
    
    orderId: {
        type: Number,
        required: true
    },
    orderNo: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    chai: {
        type: Number,
    },
    coffee: {
        type: Number,
    },
    cigarette: {
        type: Number,
    },
    cigaretteQuantity: {
        type: Number,
    },
    chaiQuantity: {
        type: Number,
    },
    coffeeQuantity: {
        type: Number,
    },
   
    orderTotal: {
        type: Number,
        required: true
    },
    paymentMode:{
        type:String,
    }
    
}, {timestamps: true});
var CknItemModel = mongoose.model('CknItem', cknItemSchema);
module.exports = CknItemModel;