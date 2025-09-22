const Usercreate = require("../../../Modles/Website Models/userRegister");

const googleRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and Email are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await Usercreate.findOne({ email: normalizedEmail });

        const lastUser = await Usercreate.findOne().sort({ id: -1 }); // sabse bada id
    const newId = lastUser ? lastUser.id + 1 : 1;
    

    if (!user) {
      // Create a new Google user
      user = await Usercreate.create({
        id: newId,
        name,
        email: normalizedEmail,
        signupMethod: "google", // ✅ automatic set
        phoneNumber: null,
        password: null,
      });

      return res.status(201).json({
        success: true,
        message: "User created via Google login",
        user,
      });
    }

    // If already Google signup user
    if (user.signupMethod === "google") {
      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user,
      });
    }

    // If user already exists with OTP method
    return res.status(200).json({
      success: true,
      message:
        "This email is already registered via OTP. Please login with your email & password.",
      user,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { googleRegister };
