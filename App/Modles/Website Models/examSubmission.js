// models/ExamSubmission.js  (update)
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String },
  text: { type: String, required: true },
  options: [{ type: String }],
  correct: { type: Number, required: true },
  explanation: { type: String },
  passage: { type: String },
  videoLink: { type: String },
  imageLink: { type: String },

  selected: { type: Number, default: null },
  status: { type: Boolean, required: true }, // true if correct
  timeTaken: { type: Number, default: 0 } // seconds
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  totalTime: { type: Number, required: true }, // seconds
  questions: [questionSchema]
});

const examSubmissionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  attempt: { type: Number, required: true },
  email: { type: String, required: true },
  examType: { type: String, required: true },
  testName: { type: String, required: true },
  sections: [sectionSchema],
  totalMarks: { type: Number, required: true },
  totalTime: { type: Number, required: true }, // seconds
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExamSubmitted", examSubmissionSchema, "ExamSubmitted");
