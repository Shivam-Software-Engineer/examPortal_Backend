const { transporter } = require("../../../Configuration/mailConfig");
const Usercreate = require("../../../Modles/Website Models/userRegister");

const { otpdata } = require("./otpSend");


// Verify OTP + Register
const otpverify = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNumber, password, otp } = req.body;

    if (!email || !phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, Phone Number and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ OTP check
    const otpRecord = otpdata.get(normalizedEmail);
    if (!otpRecord || otpRecord.otp != otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // ✅ Check if user already exists
    const existingUser = await Usercreate.findOne({ email: normalizedEmail });

    if (existingUser) {
      // 👉 Already registered, send mail
      try {
        await transporter.sendMail({
          from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
          to: normalizedEmail,
          subject: "Already Registered",
          html: `
            <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color:#c0392b; text-align:center;">⚠️ Already Registered</h2>
              <p style="font-size:16px; color:#333;">Hi <strong>${existingUser.firstname}</strong>,</p>
              <p style="font-size:15px; color:#555;">
                Our records show that <strong>${normalizedEmail}</strong> is already registered with Maxiwise Learning.
              </p>
              <p style="font-size:15px; color:#555;">
                Please login using your registered email & password to continue 🚀.
              </p>
              <p style="font-size:13px; color:#999; text-align:center; margin-top:20px;">
                © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
              </p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Error sending duplicate email mail:", mailErr);
      }

      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login with your credentials",
      });
    }
    const lastUser = await Usercreate.findOne().sort({ id: -1 }); // sabse bada id
const newId = lastUser ? lastUser.id + 1 : 1;

    // ✅ New user register
    const newUser = await Usercreate.create({
      id: newId,
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password, // ⚠️ yaha pe bcrypt hash karna zaroori hai
    });

    // ✅ OTP remove
    otpdata.delete(normalizedEmail);

    // ✅ Success mail
    try {
      await transporter.sendMail({
        from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
        to: normalizedEmail,
        subject: "Successfully Registered",
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color:#27ae60; text-align:center;">Successfully Registered!</h2>
            <p style="font-size:16px; color:#333;">Hi <strong>${firstname}</strong>,</p>
            <p style="font-size:15px; color:#555;">
              Congratulations! Your email <strong>${normalizedEmail}</strong> has been successfully registered with Maxiwise Learning.
            </p>
            <p style="font-size:15px; color:#555;">
              You can now login using your registered email & password to start your journey.
            </p>
            <p style="font-size:13px; color:#999; text-align:center; margin-top:20px;">
              © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Error sending registered mail:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully & mail sent",
      user: newUser,
    });
  } catch (err) {
    console.error("Error in verifyOtpAndRegister:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { otpverify };