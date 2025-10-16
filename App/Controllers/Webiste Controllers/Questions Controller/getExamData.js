    // controllers/getExamData.js

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
        //   quant: require("../../../Exam Data/Gre/Test1/quantQuestions").default,
        //   verbal: require("../../../Exam Data/Gre/Test1/verbalQuestions").default,
        },
    },
    sat: {
        test1: {
        //   quant: require("../../../Exam Data/Sat/Test1/quantQuestions").default,
        //   verbal: require("../../../Exam Data/Sat/Test1/verbalQuestions").default,
        },
    },
    };

   // utils/examData.js
// Adjust paths according to your project structure

const getQuestionsForSection = (examType, testName, section) => {
  try {
    const exam = allTests[examType?.toLowerCase()];
    if (!exam) return null;
    const test = exam[testName?.toLowerCase()];
    if (!test) return null;
    if (!section) return test; // returns object with sections
    return test[section.toLowerCase()] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = { allTests, getQuestionsForSection };
