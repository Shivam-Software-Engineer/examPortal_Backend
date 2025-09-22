const { transporter } = require("../../../Configuration/mailConfig");
const Usercreate = require("../../../Modles/Website Models/userRegister");
const { resetotpdata } = require("./resetPassOtp");

// ✅ Reset Password Controller
const resetpassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: 0,
        message: "Email, OTP and new password are required",
      });
    }

    // OTP Check
    const otpEntry = resetotpdata.get(email);
    if (!otpEntry) {
      return res.status(400).json({
        status: 0,
        message: "OTP not found or expired",
      });
    }

    // Expiry check (10 min = 600000 ms)
    if (Date.now() - otpEntry.createdAt > 10 * 60 * 1000) {
      resetotpdata.delete(email); // remove expired OTP
      return res.status(400).json({
        status: 0,
        message: "OTP expired",
      });
    }

    // OTP match check
    if (parseInt(otp) !== otpEntry.otp) {
      return res.status(400).json({
        status: 0,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP correct => Update password in DB
    const user = await Usercreate.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found with this email",
      });
    }

    // OTP used, delete it
    resetotpdata.delete(email);

    // Success mail
    await transporter.sendMail({
      from: '"Maxiwise Learning" <info@maxiwiselearning.online>',
      to: email,
      subject: "Password Reset Successful",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 520px; margin: auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #eee;">
          <h2 style="text-align: center; color: #2F80ED;">Maxiwise Learning</h2>
          <p style="font-size: 16px; color: #333;">Hi,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Your password has been successfully <strong>reset</strong>.  
            You can now login using your new password.
          </p>
          <p style="font-size: 14px; color: #444; text-align: center; margin-top: 20px;">
            If this wasn't you, please contact support immediately.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            © ${new Date().getFullYear()} Maxiwise Learning. All rights reserved.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      status: 1,
      message: "Password reset successful. Please login with your new password.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error while resetting password",
    });
  }
};

module.exports = { resetpassword };
