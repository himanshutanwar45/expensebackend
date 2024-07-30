const express = require('express')
const router = express.Router()
const MExpense = require('../../model/Expense/MExpense')
const MSumExpense = require('../../model/Expense/MSumExpense')
const fetchuser = require('../../middleware/fetchuser')

//Route 1 ::::::::::::::::::::::::Reports with date ::::::::::::::::::::::::/api/report/dategeneration

router.post('/report/dategeneration',fetchuser,async(req,res)=>{
    try{

        const {fromDate,toDate} = req.body;

        const query = {
            createdDate: {
                $gte: new Date(fromDate), 
                $lte: new Date(toDate)   
            }
        };
        const result = await MExpense.find(query);

        res.json(result);

    }catch(error){
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
});

//Route 2 :::::::::::::::::::::Total Expense with date :::::::::::::::::::::::::::/api/report/totalexpense
// router.post('/report/totalexpense',fetchuser,async(req, res)=>{
//     try{
//         const {fromDate,toDate} = req.body;

//         const query = {
//             createdDate: {
//                 $gte: new Date(fromDate),
//                 $lte: new Date(toDate)
//             }
//         };

//         const result = await MExpense.find(query);

//         res.json(result)
//     }catch(error){
//         return res.status(500).json({ success, error: `Internal Error Occured ${error}`});
//     }
// });


module.exports = router;