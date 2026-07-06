if (req.user.role !== "vendor") {

    return res.status(403).json({

        success: false,

        message: "Vendor access only.",

    });

}