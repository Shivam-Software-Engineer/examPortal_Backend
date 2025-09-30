const express = require("express");
const { getResultSummary, getResultDetail } = require("../../Controllers/Webiste Controllers/Result Controller/resultController");

const result = express.Router();

// Summary for all exams/tests of a user

result.get("/summary/:email", getResultSummary); //localhost:8000/website/exam/results/summary/:email

// Detail of one attempt

result.get("/:examType/:testName/:attempt", getResultDetail); //localhost:8000/website/exam/results/:examType/:testName/:attempt?email=abc@gmail.com

module.exports = result;
