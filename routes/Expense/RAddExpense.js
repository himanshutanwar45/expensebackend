const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const MExpense = require('../../model/Expense/MExpense')
const MSumExpense = require('../../model/Expense/MSumExpense')
const fetchuser = require('../../middleware/fetchuser')

//Route 1 :::::::::::::::::::::::  Add expenses ::::::::::::::::::::::::::::::/api/expense/addexpense
router.post('/addexpense',[
    body('description','Enter Description').isLength({min:1}),
    body('amount','Enter Amount').isLength({min:1})
],fetchuser,async(req,res)=>{
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(200).json({ success, error: result.errors[0].msg });
    }

    try{
        const {description,amount,date} = req.body;

        const currentUser = req.user.id;

        const query = {
            date: date,
            createdBy:currentUser
        };

        await MExpense.insertMany({
            description: description,
            amount: amount,
            date: date,
            createdBy:currentUser
        })

        let msumexpense = await MSumExpense.findOne({userId:currentUser});
        
        if(!msumexpense){
            
            await MSumExpense.insertMany({
                userId:currentUser,
                totalExpense:amount,
                currentDateExpense:amount,
                updatedBy:currentUser,
                createdBy:currentUser
            })
        }
        else{
            let prevExpense = parseFloat(msumexpense.totalExpense);
            let expenses = await MExpense.find(query);
            
            let totalSum = 0.00

            for (const amount of expenses) {
                totalSum += parseFloat(amount.amount);
            }

            await MSumExpense.updateOne({userId:currentUser},
                {$set:{ totalExpense:prevExpense + parseFloat(amount),updatedBy:currentUser,currentDateExpense:totalSum}})
        }

        res.send({ success: true, error: "Operation Successfully" })

    }catch(error){
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
});

//Route 2 :::::::::::::::::::::::: Get Total Expsense :::::::::::::::::::::::/api/expense/getexpense
router.post('/getexpense',fetchuser,async(req,res)=>{
    try{
        
        const currentUser = req.user.id;

        const query = {
            userId: currentUser
        }

        const result = await MSumExpense.find(query)
        
        res.send(result)
    }catch(error){
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}`})
    }
})

//Route 3 ::::::::::::::::::::::::Get current date expenses ::::::::::::::::/api/expense/currentdateexpense
router.post('/currentdateexpense',fetchuser,async(req,res)=>{
    try{
        const formattedDate = new Date().toISOString().split('T')[0];

        const query = {
            date: formattedDate
        };

        const result = await MExpense.find(query);

        res.send(result);

    }catch(error){
        return res.status(500).json({ success, error: `Internal Error Occured ${error}`})
    }
});


module.exports = router;