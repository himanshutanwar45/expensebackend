const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

connectToMongo();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/Login/RLogin'))

app.use('/api/expense', require('./routes/Expense/RAddExpense'))

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})