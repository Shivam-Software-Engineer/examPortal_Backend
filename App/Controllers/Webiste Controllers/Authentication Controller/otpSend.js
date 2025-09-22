const { transporter } = require("../../../Configuration/mailConfig");

const otpdata = new Map(); // Map to store OTPs and timestamps per email

// ✅ Send OTP controller
const otpsend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 0, message: "Email is required" });
  }

  try {
    // 5-digit OTP generate
    const otp = Math.floor(10000 + Math.random() * 90000);

    // Store OTP with timestamp
    otpdata.set(email, {
      otp: otp,
      createdAt: Date.now(),
    });

    // Send email
    await transporter.sendMail({
      from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 500px; margin: auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eee;">
          <h2 style="text-align: center; color: #2F80ED;">Maxiwise Learning</h2>
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">Please use the OTP below to complete your verification process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; letter-spacing: 6px; color: #2F80ED; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #444; text-align: center;">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
          <p style="font-size: 13px; color: #777; text-align: center; margin-top: 30px;">
            If you didn’t request this OTP, you can ignore this email.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
          </p>
        </div>`,
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

module.exports = { otpsend, otpdata };
