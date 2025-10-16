// models/dataInsights.js
const mongoose = require("mongoose");

const DataInsightsSubmissionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  examType: { type: String, required: true },
  testName: { type: String, required: true },
  totalMarks: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  attempt: { type: Number, default: 1 }, // 👈 NEW FIELD
  questions: { type: Array, default: [] }
});

module.exports = mongoose.model("DataInsightsSubmission", DataInsightsSubmissionSchema);
