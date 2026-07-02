import Address from "../models/Address.js";
// create address 
export const createAddress = async (req, res) => {
  try {

    const {
      fullName,
      mobile,
      houseNo,
      floor,
      landmark,
      area,
      city,
      state,
      pincode,
      latitude,
      longitude,
      formattedAddress,
      addressType,
    } = req.body;

    // Logged in user
    const user = req.user.id;

    // Agar user ka pehla address hai to default bana do
    const existingAddresses = await Address.countDocuments({ user });

    const address = await Address.create({
      user,
      fullName,
      mobile,
      houseNo,
      floor,
      landmark,
      area,
      city,
      state,
      pincode,
      latitude,
      longitude,
      formattedAddress,
      addressType,
      isDefault: existingAddresses === 0,
    });

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      address,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// get all addresses of logged in user
export const getAddresses = async (req, res) => {

  try {

    const addresses = await Address.find({
      user: req.user.id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({

      success: true,

      addresses,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};