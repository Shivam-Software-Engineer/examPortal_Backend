const { default: test1DataInsightsQuestions } = require("../../../Exam Data/Gmat/Test1/datainsightsQuestions");
const dataInsights = require("../../../Modles/Website Models/dataInsights");
const DataInsightsSession = require("../../../Modles/Website Models/dataInsightsSession");
const isEqual = require("lodash.isequal");

// Question Bank
const dataInsightsBank = {
  gmat: { test1: test1DataInsightsQuestions },
  gre: { test1: [] },
  sat: { test1: [] }
};

// ==================== GET Data Insights Questions ====================
const getDataInsightsQuestions = async (req, res) => {
  try {
    const { email, examType, testName } = req.query;

    if (!email || !examType || !testName) {
      return res.status(400).json({ status: 0, message: "Please provide email, examType, and testName" });
    }

    const questions = dataInsightsBank[examType?.toLowerCase()]?.[testName?.toLowerCase()];

    if (!questions || questions.length === 0) {
      return res.status(404).json({ status: 0, message: "No Data Insights questions found for this exam/test" });
    }

    // Create session with startTime
    await DataInsightsSession.findOneAndUpdate(
      { email, examType, testName },
      { startTime: new Date() },
      { upsert: true, new: true }
    );

    // Sanitize questions
    const sanitizedQuestions = questions.map(q => {
      const copy = { ...q };
      delete copy.correct;
      delete copy.correctAnswer;
      delete copy.explanation;
      return copy;
    });

    return res.status(200).json({
      status: 1,
      message: "Data Insights questions fetched successfully",
      data: sanitizedQuestions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

// ==================== POST Submit Data Insights Answers ====================
const submitDataInsightsAnswers = async (req, res) => {
  try {
    const { email, examType, testName, answers } = req.body;

    if (!email || !examType || !testName || !answers) {
      return res
        .status(400)
        .json({ status: 0, message: "Provide email, examType, testName and answers" });
    }

    if (!Array.isArray(answers)) {
      return res
        .status(400)
        .json({ status: 0, message: "Answers must be an array" });
    }

    // ✅ Check previous attempts
    const previousSubmissions = await dataInsights
      .find({ email, examType, testName })
      .sort({ attempt: -1 });

    if (previousSubmissions.length >= 2) {
      return res.status(400).json({
        status: 0,
        message: `You have already attempted this test ${previousSubmissions.length} times. Maximum 2 attempts allowed.`,
      });
    }

    const nextAttempt =
      previousSubmissions.length > 0
        ? previousSubmissions[0].attempt + 1
        : 1;

    const questionBank =
      dataInsightsBank[examType?.toLowerCase()]?.[testName?.toLowerCase()] || [];

    if (questionBank.length === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "No question bank found for this exam/test" });
    }

    let totalMarks = 0;

    const mergedQuestions = questionBank.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      let status = null;
      let promptsStatus = [];

      // 🟦 Case 1: PROMPTS-based (like TableAnalysis, TwoPart, etc.)
      if (q.prompts && Array.isArray(q.prompts)) {
        promptsStatus = q.prompts.map((_, idx) => {
          const userVal = userAnswer?.selected?.[idx];
          const correctVal = q.correct?.[idx];

          if (userVal === null || userVal === undefined) return null; // unattempted
          return isEqual(correctVal, userVal);
        });

        if (promptsStatus.every((p) => p === null)) {
          status = null;
        } else {
          status = promptsStatus.every(Boolean);
          if (status) totalMarks += 1;
        }
      }

      // 🟩 Case 2: OBJECT-based (MultiSourceReasoning, etc.)
      else if (typeof q.correct === "object" && !Array.isArray(q.correct)) {
        const userSel = userAnswer?.selected;

        if (userSel === null || userSel === undefined) {
          status = null;
        } else {
          const correctArr = Object.values(q.correct);
          status = isEqual(correctArr, userSel);
          if (status) totalMarks += 1;
        }
      }

      // 🟨 Case 3: NORMAL SINGLE / MULTI answer
      else {
        let userSel = userAnswer?.selected;
        let correctVal = q.correct;

        if (userSel === null || userSel === undefined) {
          status = null;
        } else {
          // Normalize both sides for comparison
          if (Array.isArray(userSel) && userSel.length === 1)
            userSel = userSel[0];
          if (Array.isArray(correctVal) && correctVal.length === 1)
            correctVal = correctVal[0];

          if (!Array.isArray(userSel) && Array.isArray(correctVal))
            userSel = [userSel];
          if (!Array.isArray(correctVal) && Array.isArray(userSel))
            correctVal = [correctVal];

          status = isEqual(correctVal, userSel);
          if (status) totalMarks += 1;
        }
      }

      return {
        ...q,
        selected: userAnswer?.selected ?? null,
        status, // true / false / null
        promptsStatus: promptsStatus.length ? promptsStatus : undefined,
      };
    });

    totalMarks = Math.round(totalMarks);

    // 🕒 Time calculation
    const session = await DataInsightsSession.findOne({
      email,
      examType,
      testName,
    });

    let totalTimeTaken = 0;
    if (session && session.startTime) {
      totalTimeTaken = Math.floor(
        (Date.now() - new Date(session.startTime).getTime()) / 1000
      );
      await DataInsightsSession.deleteOne({ _id: session._id });
    }

    // 💾 Store submission
    const submission = new dataInsights({
      email,
      examType,
      testName,
      totalMarks,
      totalTime: totalTimeTaken,
      attempt: nextAttempt,
      questions: mergedQuestions,
    });

    await submission.save();

    return res.status(200).json({
      status: 1,
      message: `Submission stored successfully (Attempt ${nextAttempt})`,
      totalMarks,
      totalTime: totalTimeTaken,
      attempt: nextAttempt,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 0, message: "Server error", error: err.message });
  }
};

module.exports = {
  getDataInsightsQuestions,
  submitDataInsightsAnswers,
};
