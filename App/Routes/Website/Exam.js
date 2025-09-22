const express = require("express");

const adaptiveRoutes = require("./adptiveRoute");

const exam = express.Router();

// // GET exam questions
// exam.get('/:examType/:testName/:section', getTestSection;
// exam.get('/:examType/:testName', getTestSection); 

exam.use("/adaptive", adaptiveRoutes) //localhost:8000/website/exam/adaptive

module.exports = { exam };
