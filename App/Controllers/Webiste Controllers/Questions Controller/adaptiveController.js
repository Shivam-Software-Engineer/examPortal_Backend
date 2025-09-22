// controllers/adaptiveController.js
const examSession = require("../../../Modles/Website Models/examSession");
const examSubmission = require("../../../Modles/Website Models/examSubmission");
const { getQuestionsForSection } = require("./getExamData");

// helper: sanitize question for sending to client
function sanitizeQuestionForClient(q) {
  if (!q) return null;
  return {
    id: q.id,
    type: q.type,
    difficulty: q.difficulty,
    text: q.text,
    options: q.options,
    imageLink: q.imageLink || null,
    passage: q.passage || null
  };
}

// generate new submission id & attempt
async function generateSubmissionMeta(email, examType, testName) {
  const lastSubmission = await examSubmission.findOne().sort({ id: -1 }).lean();
  const newId = lastSubmission ? lastSubmission.id + 1 : 1;

  const previousAttempts = await examSubmission.find({ email, examType, testName }).lean();
  const attempt = previousAttempts.length ? previousAttempts.length + 1 : 1;

  return { newId, attempt };
}

// POST /adaptive/start
const startExam = async (req, res) => {
  try {
    const { email, examType, testName, resumeSessionId } = req.body;
    if (!email || !examType || !testName) return res.status(400).json({ message: "Missing fields" });

    // Resume existing session if ID provided
    if (resumeSessionId) {
      const session = await examSession.findById(resumeSessionId);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.completed) return res.status(400).json({ message: "Session already finished" });

      // Find last unanswered question
      for (const sec of session.sections) {
        const pendingQ = sec.questions.find(q => q.status === null);
        if (pendingQ) {
          // Reset askedAt for time calculation
          pendingQ.askedAt = new Date();
          await session.save();

          const fullQ = getQuestionsForSection(session.examType, session.testName, sec.name)
            .find(q => q.id === pendingQ.questionId);

          return res.json({ sessionId: session._id, question: sanitizeQuestionForClient(fullQ), section: sec.name });
        }
      }

      // If all questions answered but session not completed
      return res.status(400).json({ message: "No pending questions, session might be finished" });
    }

    // New session logic
    const testObj = getQuestionsForSection(examType, testName);
    if (!testObj) return res.status(404).json({ message: "Test not found" });

    const sectionNames = Object.keys(testObj);
    const sections = sectionNames.map((sectionName, index) => {
      const questions = testObj[sectionName];
      const firstQ = questions.find(q => q.difficulty === "medium") || questions[0];
      return {
        name: sectionName,
        askedIds: index === 0 ? [firstQ.id] : [],
        questions: index === 0 ? [{
          questionId: firstQ.id,
          selected: null,
          correct: firstQ.correct,
          status: null,
          timeTaken: 0,
          askedAt: new Date()
        }] : [],
        totalMarks: 0,
        totalTime: 0
      };
    });

    // Generate session ID based on total sessions in collection
    const totalSessions = await examSession.countDocuments();
    const newSessionId = totalSessions + 1;

    const previousSessions = await examSession.find({ email, examType, testName }).lean();
const attemptNumber = previousSessions.length ? previousSessions.length + 1 : 1;


    const session = new examSession({
      id: newSessionId,
      attempt: attemptNumber,
      email,
      examType,
      testName,
      sections,
      startedAt: new Date(),
      completed: false
    });
    await session.save();

    const firstSection = sections[0];
    const firstQFull = getQuestionsForSection(examType, testName, firstSection.name)
      .find(q => q.id === firstSection.askedIds[0]);

    res.json({ sessionId: session._id, question: sanitizeQuestionForClient(firstQFull), section: firstSection.name });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /adaptive/submitAnswer
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, section, questionId, selected } = req.body;
    if (!sessionId || !section || typeof questionId === "undefined" || typeof selected === "undefined") {
      return res.status(400).json({ message: "Missing fields" });
    }

    const session = await examSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.completed) return res.status(400).json({ message: "Session already finished" });

    const sec = session.sections.find(s => s.name === section);
    if (!sec) return res.status(400).json({ message: "Section not part of session" });

    const sessQ = sec.questions.find(q => q.questionId === questionId);
    if (!sessQ) return res.status(400).json({ message: "Question not issued in session" });
    if (sessQ.status !== null) return res.status(400).json({ message: "Question already submitted" });

    const fullQuestions = getQuestionsForSection(session.examType, session.testName, section);
    const fullQ = fullQuestions.find(q => q.id === questionId);
    if (!fullQ) return res.status(404).json({ message: "Question data not found" });

    // ✅ calculate accumulated timeTaken if user resumed
    // Only if question is not already answered
   const now = new Date();

if (sessQ.status === null) {
    const additionalTime = sessQ.askedAt 
        ? Math.max(0, Math.round((now - sessQ.askedAt) / 1000))
        : 0;

    sessQ.timeTaken = (sessQ.timeTaken || 0) + additionalTime;
    sessQ.answeredAt = now;
    sessQ.selected = selected;
    sessQ.correct = fullQ.correct;
    sessQ.status = fullQ.correct === selected;
}

const isCorrect = sessQ.correct === selected; // <-- define here

// update section totals
sec.totalMarks = sec.questions.filter(q => q.status).length;
sec.totalTime = sec.questions.reduce((acc, q) => acc + (q.timeTaken || 0), 0);
session.totalTime = session.sections.reduce((acc, s) => acc + (s.totalTime || 0), 0);

await session.save();


    // --- adaptive next question logic ---
    let nextQ = null;
    const askedSet = new Set(sec.askedIds || []);
    let nextDifficulty = fullQ.difficulty;

    if (isCorrect) nextDifficulty = nextDifficulty === "easy" ? "medium" : nextDifficulty === "medium" ? "hard" : "hard";
    else nextDifficulty = nextDifficulty === "hard" ? "medium" : nextDifficulty === "medium" ? "easy" : "easy";

    let candidates = fullQuestions.filter(q => q.difficulty === nextDifficulty && !askedSet.has(q.id));
    if (candidates.length === 0) candidates = fullQuestions.filter(q => !askedSet.has(q.id));

    if (candidates.length > 0) {
      nextQ = candidates[Math.floor(Math.random() * candidates.length)];
      sec.askedIds.push(nextQ.id);
      sec.questions.push({
        questionId: nextQ.id,
        selected: null,
        correct: nextQ.correct,
        status: null,
        timeTaken: 0,
        askedAt: new Date()
      });
      await session.save();
      return res.json({
        message: "Answer saved",
        correct: isCorrect,
        nextQuestion: sanitizeQuestionForClient(nextQ),
        finished: false,
        section
      });
    }

    // Move to next section
    const currentIndex = session.sections.findIndex(s => s.name === section);
    const nextSection = session.sections[currentIndex + 1];
    if (nextSection) {
      const nextQFull = getQuestionsForSection(session.examType, session.testName, nextSection.name)[0];
      nextSection.askedIds.push(nextQFull.id);
      nextSection.questions.push({
        questionId: nextQFull.id,
        selected: null,
        correct: nextQFull.correct,
        status: null,
        timeTaken: 0,
        askedAt: new Date()
      });
      await session.save();
      return res.json({
        message: "Answer saved",
        correct: isCorrect,
        nextQuestion: sanitizeQuestionForClient(nextQFull),
        finished: false,
        section: nextSection.name
      });
    }

    // All sections completed → finalize exam
    session.completed = true;
    session.endedAt = new Date();
    await session.save();

    const { newId, attempt } = await generateSubmissionMeta(session.email, session.examType, session.testName);

    const sectionsWithData = session.sections.map(s => {
      const fullQs = getQuestionsForSection(session.examType, session.testName, s.name);
      const questionsFullFormat = fullQs.map(fq => {
        const userQ = s.questions.find(x => x.questionId === fq.id);
        return {
          id: fq.id,
          type: fq.type,
          text: fq.text,
          options: fq.options,
          correct: fq.correct,
          explanation: fq.explanation,
          passage: fq.passage,
          videoLink: fq.videoLink,
          imageLink: fq.imageLink,
          selected: userQ?.selected ?? null,
          status: typeof userQ?.status === "boolean" ? userQ.status : false,
          timeTaken: userQ?.timeTaken ?? 0
        };
      });
      return {
        name: s.name,
        totalMarks: questionsFullFormat.filter(q => q.status).length,
        totalTime: s.totalTime,
        questions: questionsFullFormat
      };
    });

    const totalMarks = sectionsWithData.reduce((a, b) => a + b.totalMarks, 0);
    const totalTime = session.totalTime || 0;

    const submission = new examSubmission({
      id: newId,
      attempt,
      email: session.email,
      examType: session.examType,
      testName: session.testName,
      sections: sectionsWithData,
      totalMarks,
      totalTime
    });
    await submission.save();

    res.json({
      message: "Test finished",
      correct: isCorrect,
      nextQuestion: null,
      finished: true,
      submissionId: submission._id,
      totalMarks,
      totalTime
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /adaptive/finish
const finishExam = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: "Missing sessionId" });

    const session = await examSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.completed) return res.status(400).json({ message: "Session already finished" });

    const now = new Date();
    session.endedAt = now;
    session.completed = true;

    // calculate timeTaken for each question if not already
    session.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (!q.timeTaken || q.timeTaken === 0) {
          const answeredAt = q.answeredAt || now;
          q.timeTaken = Math.max(0, Math.round((answeredAt - q.askedAt) / 1000));
        }
      });

      // update section totals
      sec.totalMarks = sec.questions.filter(q => q.status).length;
      sec.totalTime = sec.questions.reduce((acc, q) => acc + (q.timeTaken || 0), 0);
    });

    session.totalTime = session.sections.reduce((acc, s) => acc + (s.totalTime || 0), 0);
    await session.save();

    const { newId, attempt } = await generateSubmissionMeta(session.email, session.examType, session.testName);

    const sectionsWithData = session.sections.map(s => {
      const fullQs = getQuestionsForSection(session.examType, session.testName, s.name);
      const questionsFullFormat = fullQs.map(fq => {
        const userQ = s.questions.find(x => x.questionId === fq.id);
        return {
          id: fq.id,
          type: fq.type,
          text: fq.text,
          options: fq.options,
          correct: fq.correct,
          explanation: fq.explanation,
          passage: fq.passage,
          videoLink: fq.videoLink,
          imageLink: fq.imageLink,
          selected: userQ?.selected ?? null,
          status: typeof userQ?.status === "boolean" ? userQ.status : false,
          timeTaken: userQ?.timeTaken ?? 0
        };
      });
      return {
        name: s.name,
        totalMarks: questionsFullFormat.filter(q => q.status).length,
        totalTime: s.totalTime,
        questions: questionsFullFormat
      };
    });

    const totalMarks = sectionsWithData.reduce((a, b) => a + b.totalMarks, 0);
    const totalTime = session.totalTime || 0;

    const submission = new examSubmission({
      id: newId,
      attempt,
      email: session.email,
      examType: session.examType,
      testName: session.testName,
      sections: sectionsWithData,
      totalMarks,
      totalTime
    });
    await submission.save();

    res.json({ message: "Test finished and saved", submissionId: submission._id, totalMarks, totalTime });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { startExam, submitAnswer, finishExam };
