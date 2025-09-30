// Controllers/authController.js

const Usercreate = require("../../../Modles/Website Models/userRegister");

const loginController = async (req, res) => {
  const { loginMethod } = req.params;
  const { email, password } = req.body;

  try {
    // 1️⃣ Email check
    const user = await Usercreate.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    // 2️⃣ Check if blocked
    if (user.status === "blocked") {
      return res.status(403).json({ status: 0, message: "User is blocked. Contact admin." });
    }

    // 2️⃣ Manual login
    if (loginMethod === "manual") {
      // signup method check
      if (user.signupMethod !== "manual") {
        return res.status(401).json({ status: 0, message: "User registered with Google. Cannot login manually." });
      }

      // password check
      if (!password) {
        return res.status(400).json({ status: 0, message: "Password required" });
      }

      if (user.password !== password) { // hash ho toh bcrypt.compare
        return res.status(401).json({ status: 0, message: "Invalid password" });
      }
    } 
    // 3️⃣ Google login
    else if (loginMethod === "google") {
      if (user.signupMethod !== "google") {
        return res.status(401).json({ status: 0, message: "User registered manually. Cannot login with Google." });
      }
    } 
    else {
      return res.status(400).json({ status: 0, message: "Invalid login method" });
    }

    // frontend ke liye safe object
    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      signupMethod: user.signupMethod,
      phoneNumber: user.phoneNumber,
      status: user.status,
    };

    return res.status(200).json({ status: 1, message: "Login successful", user: responseUser });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};

module.exports = { loginController };
