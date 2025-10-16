const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String },
  text: { type: String, required: true },
  options: [{ type: String }],
 correct: { type: mongoose.Schema.Types.Mixed, required: true },
  explanation: { type: String, default: "" },
  passage: { type: String, default: null },
  videoLink: { type: String, default: null },
  imageLink: { type: [String], default: [] },


  selected: { type: mongoose.Schema.Types.Mixed, default: null },
  status: { type: Boolean, required: true }, // true if correct
  timeTaken: { type: Number, default: 0 } // seconds
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  totalTime: { type: Number, required: true }, // seconds
  questions: [questionSchema]
});

// examSubmissionSchema
const examSubmissionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  attempt: { type: Number, required: true },
  email: { type: String, required: true },
  examType: { type: String, required: true },
  testName: { type: String, required: true },
  sections: {
    type: [sectionSchema],
    default: [],  // sections ko dynamically push karenge
  },
  totalMarks: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 }, // seconds
  submittedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("ExamSubmission", examSubmissionSchema, "ExamSubmitted");
