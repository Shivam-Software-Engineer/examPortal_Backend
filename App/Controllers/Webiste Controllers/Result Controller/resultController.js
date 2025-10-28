const dataInsights = require("../../../Modles/Website Models/dataInsights");
const examSubmission = require("../../../Modles/Website Models/examSubmission");
const Usercreate = require("../../../Modles/Website Models/userRegister");

/* ----------------------------- SUMMARY CONTROLLER ----------------------------- */
const getResultSummary = async (req, res) => {
  try {
    const { email } = req.params;

    // Step 1: Check if user exists
    const userExists = await Usercreate.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Step 2: Fetch all submissions for this user
    const submissions = await examSubmission.find({ email });

    if (!submissions.length) {
      return res.status(404).json({ message: "No results found for this user" });
    }

    // Step 3: Group by examType + testName
    const summary = {};
    submissions.forEach((sub) => {
      const key = `${sub.examType}_${sub.testName}`;
      if (!summary[key]) {
        summary[key] = {
          examType: sub.examType,
          testName: sub.testName,
          attempts: [],
        };
      }
      summary[key].attempts.push({
        attempt: sub.attempt,
        status: sub.submittedAt ? "completed" : "pending",
        submittedAt: sub.submittedAt || null,
      });
    });

    res.json(Object.values(summary));
  } catch (err) {
    console.error("Error in getResultSummary:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------- DETAIL CONTROLLER ----------------------------- */
const getResultDetail = async (req, res) => {
  try {
    const { examType, testName, attempt } = req.params;
    const { email } = req.query;

    // console.log("🔍 Params Received:", { examType, testName, attempt, email });

    // ✅ Step 1: Validate email exists
    const userExists = await Usercreate.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // ✅ Step 2: Fetch verbal + quant submission
    const baseResult = await examSubmission.findOne({
      email,
      examType,
      testName,
      attempt: parseInt(attempt),
    });

    if (!baseResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    const resultObj = baseResult.toObject();

    // ✅ Step 3: Fetch Data Insights submission for same attempt
    const dataInsightsResult = await dataInsights.findOne({
      email,
      examType,
      testName,
      attempt: parseInt(attempt),
    });

    // ✅ Step 4: Merge Data Insights if exists
    if (dataInsightsResult) {
      const dataSection = {
        sectionName: "datainsights",
        totalMarks: dataInsightsResult.totalMarks,
        totalTime: dataInsightsResult.totalTime,
        questions: dataInsightsResult.questions,
      };

      if (!Array.isArray(resultObj.sections)) {
        resultObj.sections = [];
      }

      resultObj.sections.push(dataSection);
      resultObj.totalMarks += dataInsightsResult.totalMarks;
      resultObj.totalTime += dataInsightsResult.totalTime;
    }

    // ✅ Step 5: Return merged result
    res.json(resultObj);
  } catch (err) {
    console.error("Error in getResultDetail:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getResultSummary, getResultDetail };
