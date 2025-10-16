// models/dataInsightsSession.js
const mongoose = require("mongoose");

const DataInsightsSessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  examType: { type: String, required: true },
  testName: { type: String, required: true },
  startTime: { type: Date, default: Date.now } // ✅ session start time
});

// Optional: to avoid duplicate sessions for same user/test
DataInsightsSessionSchema.index({ email: 1, examType: 1, testName: 1 }, { unique: true });

module.exports = mongoose.model("DataInsightsSession", DataInsightsSessionSchema);
