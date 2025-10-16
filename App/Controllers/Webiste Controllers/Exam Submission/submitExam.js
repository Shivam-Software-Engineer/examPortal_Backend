const ExamSubmission = require("../../../Modles/Website Models/examSubmission");

// Helper: get questions from local JSON
const getQuestionsForSection = (examType, testName, section) => {
  try {
    const exam = examType.toLowerCase();
    const test = testName.toLowerCase();
    const sec = section.toLowerCase();

    let questions = [];
    if (exam === "gmat") {
      if (test === "test1") {
        if (sec === "quant") questions = require("../../../Exam Data/Gmat/Test1/quantQuestions").default || require("../../../Exam Data/Gmat/Test1/quantQuestions");
        if (sec === "verbal") questions = require("../../../Exam Data/Gmat/Test1/verbalQuestions").default || require("../../../Exam Data/Gmat/Test1/verbalQuestions");
        
      }
      if (test === "test2") {
        if (sec === "quant") questions = require("../../../Exam Data/Gmat/Test2/quantQuestions").default || require("../../../Exam Data/Gmat/Test2/quantQuestions");
        if (sec === "verbal") questions = require("../../../Exam Data/Gmat/Test2/verbalQuestions").default || require("../../../Exam Data/Gmat/Test2/verbalQuestions");
      }
    }
    return Array.isArray(questions) ? questions : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Helper: check multi-prompt correctness
function buildCorrectMap(fullQ) {
  if (!fullQ) return null;

  if (fullQ.correct !== undefined && fullQ.correct !== null) {
    if (Array.isArray(fullQ.correct)) {
      const map = {};
      fullQ.correct.forEach((v, i) => (map[i] = v));
      return map;
    }
    if (typeof fullQ.correct === "object") return { ...fullQ.correct };
    return { 0: fullQ.correct };
  }

  if (Array.isArray(fullQ.prompts)) {
    const map = {};
    fullQ.prompts.forEach((p, i) => (map[i] = p.correct ?? null));
    return map;
  }

  return null;
}

function buildSelectedMap(selected) {
  if (selected === null || selected === undefined) return {};
  if (Array.isArray(selected)) {
    const m = {};
    selected.forEach((v, i) => (m[i] = v));
    return m;
  }
  if (typeof selected === "object") return { ...selected };
  return { 0: selected };
}

function comparePromptAnswer(fullQ, promptIndex, corr, sel) {
  if (corr == null || sel == null) return false;

  if (typeof corr === typeof sel) return String(corr) === String(sel);

  const opts = fullQ.prompts?.[promptIndex]?.options;
  if (typeof corr === "number" && typeof sel === "string" && Array.isArray(opts)) {
    const idx = opts.findIndex(o => String(o) === String(sel));
    return String(corr) === String(idx);
  }

  if (typeof corr === "string" && typeof sel === "number" && Array.isArray(opts)) {
    return String(corr) === String(opts[sel]);
  }

  return String(corr) === String(sel);
}

function isDataInsightCorrect(fullQ, selected) {
  const correctMap = buildCorrectMap(fullQ);
  if (!correctMap) return false;

  const selectedMap = buildSelectedMap(selected);
  for (const k of Object.keys(correctMap)) {
    if (!selectedMap.hasOwnProperty(k)) return false;
    if (!comparePromptAnswer(fullQ, Number(k), correctMap[k], selectedMap[k])) return false;
  }
  return true;
}

// Submit Exam Controller
const submitExam = async (req, res) => {
  try {
    const { examType, testName } = req.params;
    const { email, sections } = req.body;

    if (!email || !sections) return res.status(400).json({ message: "Missing required fields" });

    // Generate new submission ID
    const lastSubmission = await ExamSubmission.findOne().sort({ id: -1 });
    const newId = lastSubmission ? lastSubmission.id + 1 : 1;

    // Attempt number
    const previousAttempts = await ExamSubmission.find({ email, examType, testName });
    const attemptNumber = previousAttempts.length + 1;

    let totalMarks = 0;

    const sectionsWithData = sections.map(sec => {
      const fullQuestions = getQuestionsForSection(examType, testName, sec.name);
      if (!fullQuestions) return null;

      const questions = fullQuestions.map(fq => {
        const userQ = sec.questions.find(q => q.questionId === fq.id);
        const selected = userQ?.selected ?? null;

        // Determine correctness
        const multiPromptTypes = ["GraphicsInterpretation", "TwoPartAnalysis", "TableAnalysis", "MultiSourceReasoning"];
        let status = false;
        if (multiPromptTypes.includes(fq.type)) {
          status = isDataInsightCorrect(fq, selected);
        } else {
          status = String(selected) === String(fq.correct);
        }
        if (status) totalMarks += 1;

        return {
          id: fq.id,
          type: fq.type,
          text: fq.text,
          options: fq.options || [],
          correct: fq.correct,
          explanation: fq.explanation || "",
          passage: fq.passage || null,
          videoLink: fq.videoLink || null,
          imageLink: fq.imageLink || null,
          selected,
          status,
          timeTaken: userQ?.timeTaken ?? 0
        };
      });

      return {
        name: sec.name,
        totalMarks: questions.filter(q => q.status).length,
        totalTime: questions.reduce((a, q) => a + (q.timeTaken || 0), 0),
        questions
      };
    }).filter(Boolean);

    const totalTime = sectionsWithData.reduce((sum, s) => sum + s.totalTime, 0);

    const submission = new ExamSubmission({
      id: newId,
      attempt: attemptNumber,
      email,
      examType,
      testName,
      sections: sectionsWithData,
      totalMarks,
      totalTime
    });

    await submission.save();

    res.json({
      message: "Exam submitted successfully",
      totalMarks,
      totalTime,
      sections: sectionsWithData,
      attempt: attemptNumber
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { submitExam };
