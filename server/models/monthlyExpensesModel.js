const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const monthlyExpenseSchema = new Schema({
    
    date: {
        type: String,
    }
    
}, { strict: false, timestamps: true });
var MonthlyExpenseModel = mongoose.model('monthlyExpense', monthlyExpenseSchema);
module.exports = MonthlyExpenseModel;