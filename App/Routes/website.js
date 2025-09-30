let express=require('express');
const { authentication } = require('./Website/Auth');
const { exam } = require('./Website/Exam');
const result = require('./Website/resultRouter');

let website=express.Router();

website.use('/auth', authentication)  //localhost:8000/website/auth

website.use('/exam',exam) //localhost:8000/website/exam

website.use('/exam/results',result) //localhost:8000/website/exam/results

module.exports={website};