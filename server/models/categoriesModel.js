const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const categoriesSchema = new Schema({
    
    date: {
        type: String,
    }
    
}, { strict: false, timestamps: true });
var categoriesModel = mongoose.model('categories', categoriesSchema);
module.exports = categoriesModel;