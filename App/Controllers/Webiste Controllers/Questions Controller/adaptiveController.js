// controllers/adaptiveController.js
const ExamSession = require("../../../Modles/Website Models/examSession");
const examSubmission = require("../../../Modles/Website Models/examSubmission");
const Usercreate = require("../../../Modles/Website Models/userRegister");
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
      return res.status(400).json({ status: 0, message: "Missing fields" });
    }

    // Validate user exists
    const existingUser = await Usercreate.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        status: 0,
        message: "User not registered. Please sign up first.",
      });
    }

    // Count previous submissions (for attempt limit)
    const previousSubmissionsCount = await examSubmission.countDocuments({
      email,
      examType,
      testName,
    });

    if (previousSubmissionsCount >= 2) {
      return res.status(403).json({
        status: 0,
        message: "Maximum number of attempts reached. You cannot start this exam again.",
      });
    }

    // Get questions for requested section
    const questionsForSection = getQuestionsForSection(examType, testName, section);
    if (!questionsForSection || !questionsForSection.length) {
      return res.status(400).json({ status: 0, message: "No questions found for section" });
    }

    const firstQ = questionsForSection.find(q => q.difficulty === "medium") || questionsForSection[0];

    // If resumeSessionId provided -> attempt to resume that specific session
    if (resumeSessionId) {
      const existingSession = await ExamSession.findById(resumeSessionId);
      if (existingSession && !existingSession.completed && existingSession.email === email) {
        // find the requested section inside session
        let sec = existingSession.sections.find(s => s.name === section);
        if (sec) {
          const pending = sec.questions.find(q => q.status === null);
          if (pending) {
            pending.askedAt = new Date();
            await existingSession.save();
            const fullQ = questionsForSection.find(q => q.id === pending.questionId);
            return res.json({
              status: 1,
              sessionId: existingSession._id,
              question: sanitizeQuestionForClient(fullQ),
              section,
            });
          } else {
            // section present but no pending question: return next behavior - create new question or indicate completed
            if (!sec.completed) {
              // section has no pending but not marked completed -> treat as completed
              sec.completed = true;
              await existingSession.save();
            }
            return res.status(400).json({ status: 0, message: "No pending question to resume in that section" });
          }
        } else {
          // resumeSession provided but section not present -> add the section and issue firstQ
          existingSession.sections.push(buildSectionObject(section, firstQ));
          await existingSession.save();
          return res.json({
            status: 1,
            sessionId: existingSession._id,
            question: sanitizeQuestionForClient(firstQ),
            section,
          });
        }
      } else {
        return res.status(404).json({ status: 0, message: "Resume session not found or not resumable" });
      }
    }

    // NOTE: default behaviour when resumeSessionId is NOT provided:
    // Always create a NEW session (even if there is an incomplete session).
    // This satisfies: "user start always with quant; if previous session isn't finally submitted then create new session key".

    // Build new session
    const totalSessions = await ExamSession.countDocuments();
    const newSession = new ExamSession({
      id: totalSessions + 1,
      attempt: previousSubmissionsCount + 1,
      email,
      examType,
      testName,
      sections: [buildSectionObject(section, firstQ)],
      startedAt: new Date(),
      completed: false,
    });

    await newSession.save();

    return res.json({
      status: 1,
      sessionId: newSession._id,
      question: sanitizeQuestionForClient(firstQ),
      section,
    });

  } catch (err) {
    console.error("startExam error:", err);
    return res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

/* ----------------------------- SUBMIT ANSWER ----------------------------- */
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, section, questionId, selected, autoSubmit } = req.body;
    if (!sessionId || !section) return res.status(400).json({ status: 0, message: "Missing fields" });

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ status: 0, message: "Session not found" });
    if (session.completed) return res.status(400).json({ status: 0, message: "Session already finished" });

    const sec = session.sections.find(s => s.name === section);
    if (!sec) return res.status(400).json({ status: 0, message: "Section not part of session" });

    const fullQs = getQuestionsForSection(session.examType, session.testName, section);
    const now = new Date();

    if (autoSubmit) {
      // Mark all remaining as incorrect (timeout)
      sec.questions.forEach(q => {
        if (q.status === null) {
          q.timeTaken = Math.round((now - q.askedAt) / 1000);
          q.status = false;
          q.selected = q.selected ?? null;
        }
      });
    } else {
      const sessQ = sec.questions.find(q => q.questionId === questionId);
      if (!sessQ) return res.status(400).json({ status: 0, message: "Question not issued in this session/section" });
      if (sessQ.status !== null) return res.status(400).json({ status: 0, message: "Question already answered" });

      const fullQ = fullQs.find(q => q.id === questionId);
      if (!fullQ) return res.status(404).json({ status: 0, message: "Full question not found" });

      sessQ.selected = selected;
      sessQ.correct = fullQ.correct ?? null;
      sessQ.status = String(selected) === String(fullQ.correct);
      sessQ.timeTaken = Math.round((now - sessQ.askedAt) / 1000);
      sessQ.answeredAt = now;

      // Dynamic next question selection
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
          status: 1,
          message: "Answer saved",
          nextQuestion: sanitizeQuestionForClient(nextQ),
          finished: false,
          section,
        });
      }
    }

    // If we reach here -> section is complete (either autoSubmit or no candidates)
    sec.completed = true;
    sec.totalMarks = sec.questions.filter(q => q.status).length;
    sec.totalTime = sec.questions.reduce((a, q) => a + (q.timeTaken || 0), 0);
    session.totalTime = session.sections.reduce((a, s) => a + (s.totalTime || 0), 0);
    await session.save();

    return res.json({
      status: 1,
      message: "Section completed",
      finished: true,
      section,
    });

  } catch (err) {
    console.error("submitAnswer error:", err);
    return res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

/* ----------------------------- FINISH EXAM ----------------------------- */
const finishExam = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ status: 0, message: "Missing sessionId" });

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ status: 0, message: "Session not found" });
    if (session.completed) return res.status(400).json({ status: 0, message: "Session already finished" });

    const now = new Date();

    // Complete any unanswered questions and finalize sections
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
      sec.totalTime = sec.questions.reduce((a, q) => a + (q.timeTaken || 0), 0);
    });

    session.totalTime = session.sections.reduce((a, s) => a + (s.totalTime || 0), 0);
    session.completed = true;
    session.endedAt = now;
    await session.save();

    // Enforce attempt limit again before creating submission (in case some race)
    const previousSubmissionsCount = await examSubmission.countDocuments({
      email: session.email,
      examType: session.examType,
      testName: session.testName,
    });

    if (previousSubmissionsCount >= 2) {
      return res.status(403).json({ status: 0, message: "Maximum number of attempts reached. Cannot finish exam." });
    }

    const lastSubmission = await examSubmission.findOne().sort({ id: -1 }).lean();
    const newId = lastSubmission ? lastSubmission.id + 1 : 1;
    const attempt = previousSubmissionsCount + 1;

    // Build submission structure with full question data
    const sectionsWithData = session.sections.map(s => {
      const fullQs = getQuestionsForSection(session.examType, session.testName, s.name);
      const questions = s.questions.map(sessQ => {
        const fq = fullQs.find(q => q.id === sessQ.questionId) || {};
        return {
          id: fq.id ?? sessQ.questionId,
          type: fq.type ?? null,
          text: fq.text ?? null,
          options: fq.options || [],
          correct: fq.correct ?? null,
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

    return res.json({
      status: 1,
      message: "Exam finished successfully",
      submissionId: submission._id,
    });

  } catch (err) {
    console.error("finishExam error:", err);
    return res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

module.exports = { startExam, submitAnswer, finishExam };
