// controllers/getExamData.js

/* ==========================
   🧠 All Tests Question Bank
========================== */

const allTests = {
  gmat: {
    test1: {
      quant: require("../../../Exam Data/Gmat/Test1/quantQuestions").default,
      verbal: require("../../../Exam Data/Gmat/Test1/verbalQuestions").default,
    },
    test2: {
      quant: require("../../../Exam Data/Gmat/Test2/quantQuestions").default,
      verbal: require("../../../Exam Data/Gmat/Test2/verbalQuestions").default,
    },
  },
  gre: {
    test1: {
      // quant: require("../../../Exam Data/Gre/Test1/quantQuestions").default,
      // verbal: require("../../../Exam Data/Gre/Test1/verbalQuestions").default,
    },
  },
  sat: {
    test1: {
      // quant: require("../../../Exam Data/Sat/Test1/quantQuestions").default,
      // verbal: require("../../../Exam Data/Sat/Test1/verbalQuestions").default,
    },
  },
};

/* ==========================
   📘 Helper Function
========================== */

const getQuestionsForSection = (examType, testName, section) => {
  try {
    // get exam level (like gmat / gre / sat)
    const exam = allTests[examType?.toLowerCase()];
    if (!exam) return null;

    // get test level (like test1 / test2)
    const test = exam[testName?.toLowerCase()];
    if (!test) return null;

    // if section not passed, return both sections (quant + verbal)
    if (!section) return test;

    // else return that specific section array
    return test[section.toLowerCase()] || null;
  } catch (err) {
    console.error("Error in getQuestionsForSection:", err);
    return null;
  }
};

/* ==========================
   📦 Exports
========================== */
module.exports = { allTests, getQuestionsForSection };
