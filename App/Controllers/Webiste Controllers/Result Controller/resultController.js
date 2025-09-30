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

    const result = await examSubmission.findOne({
      email,
      examType,
      testName,
      attempt: parseInt(attempt)
    });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getResultSummary, getResultDetail };
