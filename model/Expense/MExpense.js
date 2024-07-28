const mongoose = require('mongoose');
const {Schema} = mongoose;

const Expenses = new Schema({
    description:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
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
    }
});

const expense = mongoose.model('expenses',Expenses);
module.exports = expense;
