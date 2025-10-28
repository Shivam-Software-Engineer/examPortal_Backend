
const { transporter } = require("../../../Configuration/mailConfig");
const Usercreate = require("../../../Modles/Website Models/userRegister");

const googleRegister = async (req, res) => {
  try {
    let { name, firstname, lastname, email, googleId, picture } = req.body;

    // 🧩 Handle name split
    if (!firstname && name) {
      const parts = String(name).trim().split(" ");
      firstname = parts[0] || "";
      lastname = parts.slice(1).join(" ") || "";
    }

    // ✅ Validate required fields
    if (!firstname || !email) {
      return res.status(400).json({
        success: false,
        message: "Name (firstname) and Email are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 🔍 Check if user already exists
    let user = await Usercreate.findOne({ email: normalizedEmail });

    // 🔢 Generate incremental ID
    const lastUser = await Usercreate.findOne().sort({ id: -1 }).select("id").lean();
    const newId = lastUser && lastUser.id ? lastUser.id + 1 : 1;

    // 🆕 Create new user if not found
    if (!user) {
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

      // ✅ Send success registration mail
      try {
        await transporter.sendMail({
          from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
          to: normalizedEmail,
          subject: "Successfully Registered",
          html: `
            <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color:#27ae60; text-align:center;">🎉 Successfully Registered!</h2>
              <p style="font-size:16px; color:#333;">Hi <strong>${firstname}</strong>,</p>
              <p style="font-size:15px; color:#555;">
                Congratulations! Your email <strong>${normalizedEmail}</strong> has been successfully registered with Maxiwise Learning via <strong>Google Login</strong>.
              </p>
              <p style="font-size:15px; color:#555;">
                You can now access your account and continue your learning journey 🚀.
              </p>
              <p style="font-size:13px; color:#999; text-align:center; margin-top:20px;">
                © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
              </p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Error sending Google registration mail:", mailErr);
      }

      // ✅ Return created user info
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
        message: "User created via Google login & mail sent",
        user: responseUser,
      });
    }

    // 🔁 If user already exists & signed up via Google → just login
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

    // ⚠️ If already registered via Email/OTP
    return res.status(200).json({
      success: false,
      alreadyRegistered: true,
      message:
        "This email is already registered via Email/OTP. Please login normally.",
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
