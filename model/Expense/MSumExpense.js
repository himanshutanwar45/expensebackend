const mongoose = require('mongoose');
const {Schema} = mongoose;

const SummaryExpense = new Schema({
    userId:{
        type:String,
        required:true
    },
    totalExpense:{
        type:Number,
        required:true
    },
    currentDateExpense:{
        type:Number,
        required:true  
    },
    createdBy:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    updatedBy:{
        type:String,
        required:true
    },
    updatedDate:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

const summaryexpense = mongoose.model('summaryexpenses',SummaryExpense);
module.exports = summaryexpense;