const vendorMiddleware = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized."

        });

    }

    if (req.user.role !== "vendor") {

        return res.status(403).json({

            success: false,

            message: "Vendor access only."

        });

    }

    next();

};

export default vendorMiddleware;