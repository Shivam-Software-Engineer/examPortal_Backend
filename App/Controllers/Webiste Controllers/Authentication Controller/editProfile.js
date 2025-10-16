const Usercreate = require("../../../Modles/Website Models/userRegister");

exports.editProfile = async (req, res) => {
  try {
    const { email, firstname, lastname, phoneNumber } = req.body;

    if (!email) return res.status(400).json({ status: 0, message: "Email is required" });

    const user = await Usercreate.findOne({ email });
    if (!user) return res.status(404).json({ status: 0, message: "User not found" });

    // Save previous data only if there is an update
    const oldData = {};
    if (firstname && firstname !== user.firstname) oldData.firstname = user.firstname;
    if (lastname && lastname !== user.lastname) oldData.lastname = user.lastname;
    if (phoneNumber && phoneNumber !== user.phoneNumber) oldData.phoneNumber = user.phoneNumber;

    if (Object.keys(oldData).length > 0) {
      oldData.updatedAt = new Date();
      user.previousData.push(oldData);
    }

    // Update current data
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.json({
      status: 1,
      message: "Profile updated successfully",
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Something went wrong" });
  }
};
