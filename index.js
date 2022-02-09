const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');


const app = express();
app.use(express.json({}));
app.use(express.json({
    extended : true
}));

app.use(morgan('dev'));
dotenv.config({
    path:'./config/config.env'
});

connectDB();



app.use('/api/user/auth',require('./routes/user'));
const PORT = process.env.PORT || 8080;
app.listen(PORT
     , ()=> console.log('Listening on port : '+PORT));