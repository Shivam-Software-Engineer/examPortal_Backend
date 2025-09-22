let express=require('express');
const { authentication } = require('./Website/Auth');
const { exam } = require('./Website/Exam');

let website=express.Router();

website.use('/auth', authentication)  //localhost:8000/website/auth

website.use('/exam',exam) //localhost:8000/website/exam

module.exports={website};