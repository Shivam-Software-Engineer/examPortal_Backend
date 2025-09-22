const { transporter } = require("../../../Configuration/mailConfig");
const Usercreate = require("../../../Modles/Website Models/userRegister");

const resetotpdata = new Map(); // Map to store OTPs and timestamps per email

// ✅ Send OTP controller
const resetotp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 0, message: "Email is required" });
  }

  try {
    // 🔍 Check if email exists in DB
    const user = await Usercreate.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "Wrong email, this is not registered",
      });
    }

    // ✅ 5-digit OTP generate
    const otp = Math.floor(10000 + Math.random() * 90000);

    // ✅ Store OTP with timestamp
    resetotpdata.set(email, {
      otp: otp,
      createdAt: Date.now(),
    });

    // ✅ Send email
    await transporter.sendMail({
      from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
      to: email,
      subject: "Reset Your Password - OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 520px; margin: auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #eee;">
    <h2 style="text-align: center; color: #2F80ED; margin-bottom: 20px;">Maxiwise Learning</h2>
    <p style="font-size: 16px; color: #333;">Hi ${user.name || ""},</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      We received a request to <strong>reset your password</strong>.  
      Use the OTP below to proceed with resetting your account password:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; letter-spacing: 6px; color: #2F80ED; font-weight: bold;">${otp}</span>
    </div>
    <p style="font-size: 14px; color: #444; text-align: center;">
      This OTP will expire in <strong>10 minutes</strong>.  
      If you didn’t request a password reset, please ignore this email.
    </p>
    <div style="margin-top: 30px; padding: 16px; background: #f9fafc; border-radius: 8px; border: 1px solid #e5eaf0;">
      <p style="font-size: 13px; color: #555; text-align: center; margin: 0;">
        For security reasons, do not share this OTP with anyone.  
      </p>
    </div>
    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
    </p>
  </div>
`
    });

    return res.status(200).json({
      status: 1,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      status: 0,
      message: "Failed to send OTP",
    });
  }
};

module.exports = { resetotp, resetotpdata };
