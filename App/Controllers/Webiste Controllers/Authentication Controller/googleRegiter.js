const Usercreate = require("../../../Modles/Website Models/userRegister");

const googleRegister = async (req, res) => {
  try {
    // Accept either: { name, email, googleId, picture } OR { firstname, lastname, email, googleId, picture }
    let { name, firstname, lastname, email, googleId, picture } = req.body;

    // Build firstname/lastname from name if provided
    if (!firstname && name) {
      const parts = String(name).trim().split(" ");
      firstname = parts[0] || "";
      lastname = parts.slice(1).join(" ") || "";
    }

    // Validate
    if (!firstname || !email) {
      return res.status(400).json({
        success: false,
        message: "Name (firstname) and Email are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Find existing user by email
    let user = await Usercreate.findOne({ email: normalizedEmail });

    // Generate incremental id (not perfect for concurrency but ok for small apps)
    const lastUser = await Usercreate.findOne().sort({ id: -1 }).select("id").lean();
    const newId = lastUser && lastUser.id ? lastUser.id + 1 : 1;

    if (!user) {
      // Create new Google user (map to schema fields)
      const newUserData = {
        id: newId,
        firstname,
        lastname: lastname || "",
        email: normalizedEmail,
        signupMethod: "google",
        phoneNumber: null,
        password: null,
        googleId: googleId || null,
        picture: picture || null,
      };

      user = await Usercreate.create(newUserData);

      // Return created user (safe shape)
      const responseUser = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        signupMethod: user.signupMethod,
        phoneNumber: user.phoneNumber,
        status: user.status,
        googleId: user.googleId,
        picture: user.picture,
        createdAt: user.createdAt,
      };

      return res.status(201).json({
        success: true,
        message: "User created via Google login",
        user: responseUser,
      });
    }

    // If user exists and is Google signup → return user
    if (user.signupMethod === "google") {
      const responseUser = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        signupMethod: user.signupMethod,
        phoneNumber: user.phoneNumber,
        status: user.status,
        googleId: user.googleId,
        picture: user.picture,
        createdAt: user.createdAt,
      };

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: responseUser,
      });
    }

    // If user exists but registered manually → notify frontend
    return res.status(200).json({
      success: false,
      alreadyRegistered: true,
      message: "This email is already registered via Email/OTP. Please login normally.",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        signupMethod: user.signupMethod,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while Google login",
      error: error.message,
    });
  }
};

module.exports = { googleRegister };
