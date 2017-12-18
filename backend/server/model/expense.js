const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const _ = require('lodash');
var ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, 'The {VALUE} must be between 0 or more than 0.'],
        integer: true,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});
ExpenseSchema.statics.findByName = function(name){
    var Expense = this;
    if(name == '') {
        return Promise.reject("Invalid expense name");
    }
    var expensedata = Expense.find({
        'name': name
    });
    return expensedata;
};
ExpenseSchema.pre('save', function(next) {
    var Expense = this;
    try {
        Expense.updatedAt = moment().valueOf();
        next();
    } catch(e) {
        console.log("Error in saving/updating updatedAt for expense:"+e);
        next();
    }
});
var Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = {Expense};
