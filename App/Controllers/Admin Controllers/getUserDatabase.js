const moment = require("moment-timezone");
const Usercreate = require("../../Modles/Website Models/userRegister");
const mongoose = require("mongoose");

const getUserData = async (req, res) => {
  try {
    const { email, includeExams } = req.query; // extra flag

    const matchStage = email ? { email } : {};

    // aggregation pipeline
    const users = await Usercreate.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "ExamSubmitted", // exact collection name
          localField: "email",
          foreignField: "email",
          as: "examSubmissions",
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
          _id: 0,
        },
      },
    ]);

    if (email && users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Format dates + calculate totalExams + examStats
    const formattedUsers = users.map((user) => {
      // examSubmissions ko format karna
      const examSubmissions = includeExams === "true"
        ? user.examSubmissions.map((exam) => ({
            ...exam,
            submittedAt: exam.submittedAt
              ? moment(exam.submittedAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")
              : null,
          }))
        : [];

      // total exams
      const totalExams = examSubmissions.length;

      // examStats: examType -> testName -> count
      const examStats = {};
      examSubmissions.forEach((exam) => {
        if (!examStats[exam.examType]) examStats[exam.examType] = {};
        if (!examStats[exam.examType][exam.testName]) examStats[exam.examType][exam.testName] = 0;
        examStats[exam.examType][exam.testName]++;
      });

    return {
  id: user.id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  signupMethod: user.signupMethod,
  createdAt: user.createdAt
    ? moment(user.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")
    : null,
  updatedAt: user.updatedAt
    ? moment(user.updatedAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")
    : null,

  totalExams,
  examStats,

  examSubmissions
};


    });

    return res.status(200).json({
      success: true,
      totalUsers: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserData };
