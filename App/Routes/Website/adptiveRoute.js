// routes/adaptiveRoutes.js
const express = require("express");
const { startExam, submitAnswer, finishExam } = require("../../Controllers/Webiste Controllers/Questions Controller/adaptiveController");
const adaptiveRoutes = express.Router();

adaptiveRoutes.post("/start", startExam);       //localhost:8000/website/exam/adaptive/start
adaptiveRoutes.post("/submit", submitAnswer);   //localhost:8000/website/exam/adaptive/submit
adaptiveRoutes.post("/finish", finishExam);     //localhost:8000/website/exam/adaptive/finish

module.exports = adaptiveRoutes;
