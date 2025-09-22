// models/ExamSession.js
const mongoose = require("mongoose");

const sessionQuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  selected: { type: Number, default: null },
  correct: { type: Number, default: null }, // store correct for server-side check
  status: { type: Boolean, default: null }, // null => not answered yet
  timeTaken: { type: Number, default: 0 }, // seconds
  askedAt: { type: Date, default: Date.now },
  answeredAt: { type: Date }
});

const sessionSectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "quant" / "verbal"
  askedIds: { type: [Number], default: [] },
  questions: { type: [sessionQuestionSchema], default: [] },
  totalMarks: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 } // seconds accumulated in this section
});

const examSessionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // session global id
  attempt: { type: Number, required: true },          // attempt count
  email: { type: String, required: true },
  examType: { type: String },
  testName: { type: String },
  sections: { type: [sessionSectionSchema], default: [] },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  totalTime: { type: Number, default: 0 },           // total time of all answered questions
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("ExamSession", examSessionSchema);
