const { transporter } = require("../../../Configuration/mailConfig");
const Usercreate = require("../../../Modles/Website Models/userRegister");

const googleRegister = async (req, res) => {
  try {
    let { name, firstname, lastname, email, googleId, picture } = req.body;

    if (!firstname && name) {
      const parts = String(name).trim().split(" ");
      firstname = parts[0] || "";
      lastname = parts.slice(1).join(" ") || "";
    }

    if (!firstname || !email) {
      return res.status(400).json({
        success: false,
        message: "Name (firstname) and Email are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // check existing user
    let user = await Usercreate.findOne({ email: normalizedEmail });

    // if user exists → do NOT login, just show error
    if (user) {
      return res.status(400).json({
        success: false,
        alreadyRegistered: true,
        message: "This email is already registered. Please login.",
      });
    }

    // create new user
    const lastUser = await Usercreate.findOne().sort({ id: -1 }).select("id").lean();
    const newId = lastUser && lastUser.id ? lastUser.id + 1 : 1;

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

    const newUser = await Usercreate.create(newUserData);

    try {
      await transporter.sendMail({
        from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
        to: normalizedEmail,
        subject: "Successfully Registered",
        html: `
          <div style="font-family: Arial; padding:20px; max-width:600px; margin:auto;">
            <h2 style="color:#27ae60; text-align:center;">Successfully Registered!</h2>
            <p>Hi <strong>${firstname}</strong>,</p>
            <p>Your email <strong>${normalizedEmail}</strong> has been registered via <strong>Google Login</strong>.</p>
            <p>You can now login and continue learning 🚀</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.log("Mail error:", mailErr);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully via Google",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        signupMethod: newUser.signupMethod,
        googleId: newUser.googleId,
        picture: newUser.picture,
        createdAt: newUser.createdAt,
      },
    });

  } catch (error) {
    console.error("Google Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while Google signup",
      error: error.message,
    });
  }
};

module.exports = { googleRegister };
