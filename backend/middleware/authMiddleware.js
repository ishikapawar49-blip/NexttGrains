import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {

    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found.",

                });

            }

            if (user.isBlocked) {

                return res.status(403).json({

                    success: false,

                    message: "Your account has been blocked.",

                });

            }

            req.user = {

                id: user._id,

                role: user.role,

                name: user.name,

            };

            next();

        }

        else {

            return res.status(401).json({

                success: false,

                message: "Authorization token missing.",

            });

        }

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token.",

        });

    }

};

export default authMiddleware;