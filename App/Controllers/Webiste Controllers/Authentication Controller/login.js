const Usercreate = require("../../../Modles/Website Models/userRegister");

const loginController = async (req, res) => {
  const { loginMethod } = req.params;
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ status: 0, message: "Email required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 1️⃣ Email check
    const user = await Usercreate.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    // 2️⃣ Check if blocked
    if (user.status === "blocked") {
      return res.status(403).json({ status: 0, message: "User is blocked. Contact admin." });
    }

    // 3️⃣ Manual login
    if (loginMethod === "manual") {
      if (user.signupMethod !== "manual") {
        return res.status(401).json({ status: 0, message: "User registered with Google. Cannot login manually." });
      }

      if (!password) {
        return res.status(400).json({ status: 0, message: "Password required" });
      }

      // !!! Replace with bcrypt.compare if you store hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ status: 0, message: "Invalid password" });
      }
    } 
    // 4️⃣ Google login
    else if (loginMethod === "google") {
      if (user.signupMethod !== "google") {
        return res.status(401).json({ status: 0, message: "User registered manually. Cannot login with Google." });
      }
      // no password check for google
    } 
    else {
      return res.status(400).json({ status: 0, message: "Invalid login method" });
    }

    // frontend safe object
    const responseUser = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      signupMethod: user.signupMethod,
      phoneNumber: user.phoneNumber,
      status: user.status,
      createdAt: user.createdAt,
      picture: user.picture || null,
    };

    return res.status(200).json({ status: 1, message: "Login successful", user: responseUser });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};

module.exports = { loginController };
