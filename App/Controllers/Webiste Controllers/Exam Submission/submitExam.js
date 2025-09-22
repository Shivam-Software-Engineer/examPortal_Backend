const examSubmission = require("../../../Modles/Website Models/examSubmission");
const Usercreate = require("../../../Modles/Website Models/userRegister");

// Function to get full questions for a given examType/testName/section
const getQuestionsForSection = (examType, testName, section) => {
  try {
    const exam = examType.toLowerCase();
    const test = testName.toLowerCase();
    const sec = section.toLowerCase();

    if (exam === "gmat") {
      if (test === "test1") {
        if (sec === "quant") return require("../../../Exam Data/Gmat/Test1/quantQuestions").default;
        if (sec === "verbal") return require("../../../Exam Data/Gmat/Test1/verbalQuestions").default;
      }
      if (test === "test2") {
        if (sec === "quant") return require("../../../Exam Data/Gmat/Test2/quantQuestions").default;
        if (sec === "verbal") return require("../../../Exam Data/Gmat/Test2/verbalQuestions").default;
      }
    }

    // TODO: Add GRE/SAT similarly
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const submitExam = async (req, res) => {
  try {
    const { examType, testName } = req.params;
    const { email, sections } = req.body;

    if (!email || !sections) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Generate unique submission ID safely
    const lastSubmission = await examSubmission.findOne().sort({ id: -1 });
    const lastId = lastSubmission && !isNaN(lastSubmission.id) ? lastSubmission.id : 0;
    const newId = lastId + 1;

    // 2️⃣ Calculate attempt number for this user/exam/test
    const previousAttempts = await examSubmission.find({ email, examType, testName });
    const attemptNumber = previousAttempts.length + 1;

    let totalMarks = 0;

    // 3️⃣ Map sections and questions
    const sectionsWithData = sections.map(sec => {
      const fullQuestions = getQuestionsForSection(examType, testName, sec.name);
      if (!fullQuestions) return null;

      const questions = fullQuestions.map(fullQ => {
        const userQ = sec.questions.find(q => q.id === fullQ.id);

        // Handle selected answer & status
        const selected = userQ?.selected ?? null; // null if not answered
        const status = typeof selected === "number" ? selected === fullQ.correct : false;

        if (status) totalMarks += 1;

        return {
          id: fullQ.id,
          type: fullQ.type,
          text: fullQ.text,
          options: fullQ.options,
          correct: fullQ.correct,
          explanation: fullQ.explanation,
          passage: fullQ.passage,
          videoLink: fullQ.videoLink,
          imageLink: fullQ.imageLink,
          selected,
          status
        };
      });

      const sectionTotal = questions.filter(q => q.status).length;

      return { name: sec.name, totalMarks: sectionTotal, questions };
    }).filter(Boolean);

    // 4️⃣ Save submission to DB
    const submission = new examSubmission({
      id: newId,
      attempt: attemptNumber,
      email,
      examType,
      testName,
      sections: sectionsWithData,
      totalMarks
    });

    await submission.save();

    // 5️⃣ Response
    res.json({
      message: "Exam submitted successfully",
      totalMarks,
      sections: sectionsWithData,
      attempt: attemptNumber
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { submitExam };
