// controllers/adaptiveController.js
const ExamSession = require("../../../Modles/Website Models/examSession");
const examSubmission = require("../../../Modles/Website Models/examSubmission");
const { getQuestionsForSection } = require("./getExamData");

/* ----------------------------- HELPERS ----------------------------- */
function sanitizeQuestionForClient(q) {
  if (!q) return null;
  return {
    id: q.id,
    type: q.type,
    difficulty: q.difficulty,
    text: q.text || null,
    options: q.options || [],
    passage: q.passage || null,
    imageLink: q.imageLink || null,
    videoLink: q.videoLink || null,
    instructions: q.instructions || null,
  };
}

function buildSectionObject(sectionName, firstQ) {
  return {
    name: sectionName,
    askedIds: [firstQ.id],
    completed: false,
    questions: [
      {
        questionId: firstQ.id,
        selected: null,
        correct: firstQ.correct ?? null,
        status: null,
        timeTaken: 0,
        askedAt: new Date(),
      },
    ],
    totalMarks: 0,
    totalTime: 0,
  };
}

/* ----------------------------- START EXAM ----------------------------- */
const startExam = async (req, res) => {
  try {
    const { email, examType, testName, section, resumeSessionId } = req.body;
    if (!email || !examType || !testName || !section) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Existing incomplete session
    let session = await ExamSession.findOne({ email, examType, testName, completed: false });

    let previousSubmissions = [];
    if (!session) {
      previousSubmissions = await examSubmission.find({ email, examType, testName }).lean();
      if (previousSubmissions.length >= 2) {
        return res.status(403).json({
          message: "Maximum number of attempts reached. You cannot start this exam again.",
        });
      }
    }

    const questionsForSection = getQuestionsForSection(examType, testName, section);
    if (!questionsForSection.length) return res.status(400).json({ message: "No questions found" });

    const firstQ = questionsForSection.find(q => q.difficulty === "medium") || questionsForSection[0];

    // Resume session logic
    if (resumeSessionId) {
      const existingSession = await ExamSession.findById(resumeSessionId);
      if (existingSession && !existingSession.completed) {
        let sec = existingSession.sections.find(s => s.name === section);
        if (sec) {
          const pending = sec.questions.find(q => q.status === null);
          if (pending) {
            pending.askedAt = new Date();
            await existingSession.save();
            const fullQ = questionsForSection.find(q => q.id === pending.questionId);
            return res.json({
              sessionId: existingSession._id,
              question: sanitizeQuestionForClient(fullQ),
              section,
            });
          }
        }
      }
    }

    // Create new session
    if (!session) {
      const totalSessions = await ExamSession.countDocuments();
      session = new ExamSession({
        id: totalSessions + 1,
        attempt: previousSubmissions.length + 1,
        email,
        examType,
        testName,
        sections: [buildSectionObject(section, firstQ)],
        startedAt: new Date(),
        completed: false,
      });
      await session.save();
      return res.json({ sessionId: session._id, question: sanitizeQuestionForClient(firstQ), section });
    }

    // Add section if missing
    let sec = session.sections.find(s => s.name === section);
    if (!sec) {
      session.sections.push(buildSectionObject(section, firstQ));
      await session.save();
      sec = session.sections.find(s => s.name === section);
    }

    // Return first pending question
    const pending = sec.questions.find(q => q.status === null) || sec.questions[0];
    const fullQ = questionsForSection.find(q => q.id === pending.questionId);
    return res.json({ sessionId: session._id, question: sanitizeQuestionForClient(fullQ), section });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ----------------------------- SUBMIT ANSWER ----------------------------- */
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, section, questionId, selected, autoSubmit } = req.body;
    if (!sessionId || !section) return res.status(400).json({ message: "Missing fields" });

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.completed) return res.status(400).json({ message: "Session finished" });

    const sec = session.sections.find(s => s.name === section);
    if (!sec) return res.status(400).json({ message: "Section not part of session" });

    const fullQs = getQuestionsForSection(session.examType, session.testName, section);
    const now = new Date();

    if (autoSubmit) {
      sec.questions.forEach(q => {
        if (q.status === null) {
          q.timeTaken = Math.round((now - q.askedAt) / 1000);
          q.status = false;
          q.selected = q.selected ?? null;
        }
      });
    } else {
      const sessQ = sec.questions.find(q => q.questionId === questionId);
      if (!sessQ) return res.status(400).json({ message: "Question not issued" });
      if (sessQ.status !== null) return res.status(400).json({ message: "Already answered" });

      const fullQ = fullQs.find(q => q.id === questionId);
      if (!fullQ) return res.status(404).json({ message: "Full question not found" });

      sessQ.selected = selected;
      sessQ.correct = fullQ.correct ?? null;
      sessQ.status = String(selected) === String(fullQ.correct);
      sessQ.timeTaken = Math.round((now - sessQ.askedAt) / 1000);
      sessQ.answeredAt = now;

      // Dynamic next question
      const difficultyOrder = ["easy", "medium", "hard"];
      let idx = difficultyOrder.indexOf(fullQ.difficulty);
      idx = sessQ.status ? Math.min(idx + 1, 2) : Math.max(idx - 1, 0);
      const nextDifficulty = difficultyOrder[idx];

      const askedSet = new Set(sec.askedIds);
      let candidates = fullQs.filter(q => q.difficulty === nextDifficulty && !askedSet.has(q.id));
      if (!candidates.length) candidates = fullQs.filter(q => !askedSet.has(q.id));

      if (candidates.length) {
        const nextQ = candidates[Math.floor(Math.random() * candidates.length)];
        sec.askedIds.push(nextQ.id);
        sec.questions.push({
          questionId: nextQ.id,
          selected: null,
          correct: nextQ.correct ?? null,
          status: null,
          timeTaken: 0,
          askedAt: new Date(),
        });
        await session.save();
        return res.json({
          message: "Answer saved",
          nextQuestion: sanitizeQuestionForClient(nextQ),
          finished: false,
          section,
        });
      }
    }

    // Section complete
    sec.completed = true;
    sec.totalMarks = sec.questions.filter(q => q.status).length;
    sec.totalTime = sec.questions.reduce((a, q) => a + (q.timeTaken || 0), 0);
    session.totalTime = session.sections.reduce((a, s) => a + s.totalTime, 0);
    await session.save();

    return res.json({
      message: "Section completed",
      finished: true,
      section,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ----------------------------- FINISH EXAM ----------------------------- */
const finishExam = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: "Missing sessionId" });

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.completed) return res.status(400).json({ message: "Session already finished" });

    const now = new Date();

    // Complete all sections & questions
    session.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (q.status === null) {
          q.status = false;
          q.selected = q.selected ?? null;
          q.timeTaken = Math.round((now - q.askedAt) / 1000);
        }
      });
      sec.completed = true;
      sec.totalMarks = sec.questions.filter(q => q.status).length;
      sec.totalTime = sec.questions.reduce((a, q) => a + q.timeTaken, 0);
    });

    session.totalTime = session.sections.reduce((a, s) => a + s.totalTime, 0);
    session.completed = true;
    session.endedAt = now;
    await session.save();

    // Create submission
    const previousSubmissions = await examSubmission.find({ email: session.email, examType: session.examType, testName: session.testName }).lean();
    if (previousSubmissions.length >= 2) {
      return res.status(403).json({ message: "Maximum number of attempts reached. Cannot finish exam." });
    }

    const lastSubmission = await examSubmission.findOne().sort({ id: -1 });
    const newId = lastSubmission ? lastSubmission.id + 1 : 1;
    const attempt = previousSubmissions.length + 1;

    const sectionsWithData = session.sections.map(s => {
      const fullQs = getQuestionsForSection(session.examType, session.testName, s.name);
      const questions = s.questions.map(sessQ => {
        const fq = fullQs.find(q => q.id === sessQ.questionId);
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
          selected: sessQ.selected ?? null,
          status: !!sessQ.status,
          timeTaken: sessQ.timeTaken ?? 0,
        };
      });

      return {
        name: s.name,
        totalMarks: questions.filter(q => q.status).length,
        totalTime: questions.reduce((a, q) => a + q.timeTaken, 0),
        questions,
      };
    });

    const submission = new examSubmission({
      id: newId,
      attempt,
      email: session.email,
      examType: session.examType,
      testName: session.testName,
      sections: sectionsWithData,
      totalMarks: sectionsWithData.reduce((a, s) => a + s.totalMarks, 0),
      totalTime: session.totalTime,
      submittedAt: now,
    });

    await submission.save();

    res.json({
      status: 1,
      message: "Exam finished successfully",
      submissionId: submission._id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
  console.log("Finish exam called for sessionId:", req.body.sessionId);
};

module.exports = { startExam, submitAnswer, finishExam };
