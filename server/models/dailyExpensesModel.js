const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const dailyExpenseSchema = new Schema({
    
    date: {
        type: String,
    }
    
}, { strict: false, timestamps: true });
var DailyExpenseModel = mongoose.model('dailyExpense', dailyExpenseSchema);
module.exports = DailyExpenseModel;