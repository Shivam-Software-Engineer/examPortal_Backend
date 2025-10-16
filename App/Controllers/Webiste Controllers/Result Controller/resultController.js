const dataInsights = require("../../../Modles/Website Models/dataInsights");
const examSubmission = require("../../../Modles/Website Models/examSubmission");

// Summary controller
const getResultSummary = async (req, res) => {
  try {
    const { email } = req.params;

    // All submissions of this user
    const submissions = await examSubmission.find({ email });

    // Group by examType + testName
    const summary = {};
    submissions.forEach(sub => {
      const key = `${sub.examType}_${sub.testName}`;
      if (!summary[key]) {
        summary[key] = {
          examType: sub.examType,
          testName: sub.testName,
          attempts: []
        };
      }
      summary[key].attempts.push({
        attempt: sub.attempt,
        status: sub.submittedAt ? "completed" : "pending",
        submittedAt: sub.submittedAt || null
      });
    });

    res.json(Object.values(summary));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Detail controller
const getResultDetail = async (req, res) => {
  try {
    const { examType, testName, attempt } = req.params;
    const { email } = req.query;

    // Step 1: Fetch verbal + quant submission
    const baseResult = await examSubmission.findOne({
      email,
      examType,
      testName,
      attempt: parseInt(attempt),
    });

    if (!baseResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Convert to plain JS object so we can modify it freely
    const resultObj = baseResult.toObject();

    // Step 2: Fetch Data Insights submission for the same attempt
    const dataInsightsResult = await dataInsights.findOne({
      email,
      examType,
      testName,
      attempt: parseInt(attempt),
    });

    // Step 3: If Data Insights result exists → merge
    if (dataInsightsResult) {
      // Prepare a Data Insights section object
      const dataSection = {
        sectionName: "Data Insights",
        totalMarks: dataInsightsResult.totalMarks,
        totalTime: dataInsightsResult.totalTime,
        questions: dataInsightsResult.questions,
      };

      // If sections doesn't exist, initialize it
      if (!Array.isArray(resultObj.sections)) {
        resultObj.sections = [];
      }

      // Push Data Insights section into the sections array
      resultObj.sections.push(dataSection);

      // Add Data Insights total to the overall totals
      resultObj.totalMarks += dataInsightsResult.totalMarks;
      resultObj.totalTime += dataInsightsResult.totalTime;
    }

    // Step 4: Return the combined result
    res.json(resultObj);

  } catch (err) {
    console.error("Error in getResultDetail:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getResultSummary, getResultDetail };
