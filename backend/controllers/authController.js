import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// =======================
// Generate JWT Token
// =======================

const generateToken = (id) => {

    return jwt.sign(

        { id },

        process.env.JWT_SECRET,

        {

            expiresIn: "7d"

        }

    );

};


// =======================
// REGISTER USER
// =======================

export const registerUser = async (req, res) => {

    try {

        const {

            name,
            email,
            phone,
            password

        } = req.body;


        if (

            !name ||
            !email ||
            !phone ||
            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all fields"

            });

        }


        const existingEmail = await User.findOne({

            email

        });


        if (existingEmail) {

            return res.status(400).json({

                success: false,

                message: "Email already exists"

            });

        }


        const existingPhone = await User.findOne({

            phone

        });


        if (existingPhone) {

            return res.status(400).json({

                success: false,

                message: "Phone already exists"

            });

        }


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(

            password,

            salt

        );


        const user = await User.create({

            name,

            email,

            phone,

            password: hashedPassword

        });


        const token = generateToken(

            user._id

        );


        res.status(201).json({

            success: true,

            message: "Registration Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// =======================
// LOGIN USER
// =======================

export const loginUser = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;


        if (

            !email ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "Please enter email and password"

            });

        }


        const user = await User.findOne({

            email

        });


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        const isMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Credentials"

            });

        }


        const token = generateToken(

            user._id

        );


        res.status(200).json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// =======================
// GET PROFILE
// =======================

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(

            req.user.id

        ).select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};