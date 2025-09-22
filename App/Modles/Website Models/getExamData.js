// // models/Test.js
// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//   id: { type: Number, required: true }, // unique question ID within a section
//   type: { type: String, required: true }, // e.g., 'Algebra', 'RC'
//   text: { type: String, required: true }, // question text
//   options: { type: [String], required: true }, // answer options
//   correct: { type: mongoose.Schema.Types.Mixed, required: true }, // can be number, array, etc.
//   explanation: { type: String }, // optional explanation text
//   passage: { type: String }, // optional, for RC
//   imageUrl: { type: String }, // optional image URL
//   videoUrl: { type: String }  // optional video URL
// });

// const sectionSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // 'quant', 'verbal', 'dataInsight'
//   questions: [questionSchema]
// });

// const testSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // 'test1', 'test2', etc.
//   sections: [sectionSchema],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Test', testSchema);
