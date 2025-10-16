const { default: test1DataInsightsQuestions } = require("../../../Exam Data/Gmat/Test1/datainsightsQuestions");
const dataInsights = require("../../../Modles/Website Models/dataInsights");
const DataInsightsSession = require("../../../Modles/Website Models/dataInsightsSession");

// Question Bank
const dataInsightsBank = {
  gmat: {
    test1: test1DataInsightsQuestions,
  },
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

// ==================== Helper: Compare Selected vs Correct ====================
const isEqual = (userSelected, correct) => {
  const convert = (v) => {
    if (Array.isArray(v)) return v.map(Number);
    if (typeof v === "object" && v !== null) return Object.values(v).map(Number);
    return [Number(v)];
  };

  const a = convert(userSelected);
  const b = convert(correct);

  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
};

// ==================== POST Submit Data Insights Answers ====================
// ==================== POST Submit Data Insights Answers ====================
const submitDataInsightsAnswers = async (req, res) => {
  try {
    const { email, examType, testName, answers } = req.body;

    if (!email || !examType || !testName || !answers) {
      return res.status(400).json({ status: 0, message: "Provide email, examType, testName and answers" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ status: 0, message: "Answers must be an array" });
    }

    // ✅ Step 1: Check previous attempts
    const previousSubmissions = await dataInsights.find({
      email,
      examType,
      testName
    }).sort({ attempt: -1 });  // latest attempt first

    if (previousSubmissions.length >= 2) {
      return res.status(400).json({
        status: 0,
        message: `You have already attempted this test ${previousSubmissions.length} times. Maximum 2 attempts allowed.`
      });
    }

    // ✅ Step 2: Determine attempt number
    const nextAttempt = previousSubmissions.length > 0
      ? previousSubmissions[0].attempt + 1
      : 1;

    // Fetch question bank
    const questionBank = dataInsightsBank[examType?.toLowerCase()]?.[testName?.toLowerCase()] || [];
    if (questionBank.length === 0) {
      return res.status(404).json({ status: 0, message: "No question bank found for this exam/test" });
    }

    let totalMarks = 0;

    const mergedQuestions = questionBank.map(q => {
      const userAnswer = answers.find(a => a.questionId === q.id);
      let status = false;
      let promptsStatus = [];

      if (q.prompts && Array.isArray(q.prompts)) {
        promptsStatus = q.prompts.map((prompt, idx) => {
          const userSelected = userAnswer?.selected?.[idx];
          return typeof prompt.correct !== "undefined" ? isEqual(userSelected, prompt.correct) : false;
        });

        status = promptsStatus.every(s => s === true);
        if (status) totalMarks += 1;
      } else {
        if (typeof q.correct !== "undefined") {
          const userSelected = userAnswer?.selected;
          status = isEqual(userSelected, q.correct);
          if (status) totalMarks += 1;
        }
      }

      return {
        ...q,
        selected: userAnswer?.selected || null,
        status,
        promptsStatus: promptsStatus.length > 0 ? promptsStatus : undefined
      };
    });

    totalMarks = Math.round(totalMarks * 100) / 100;

    // Calculate total time from session
    const session = await DataInsightsSession.findOne({ email, examType, testName });
    let totalTimeTaken = 0;
    if (session && session.startTime) {
      totalTimeTaken = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
      await DataInsightsSession.deleteOne({ _id: session._id });
    }

    // ✅ Step 3: Save submission with attempt number
    const submission = new dataInsights({
      email,
      examType,
      testName,
      totalMarks,
      totalTime: totalTimeTaken,
      attempt: nextAttempt,   // 👈 Store attempt
      questions: mergedQuestions
    });
    await submission.save();

    return res.status(200).json({
      status: 1,
      message: `Submission stored successfully (Attempt ${nextAttempt})`,
      totalMarks,
      totalTime: totalTimeTaken,
      attempt: nextAttempt
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};


module.exports = {
  getDataInsightsQuestions,
  submitDataInsightsAnswers
};
