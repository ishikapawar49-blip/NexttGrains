if (req.user.role !== "admin") {

    return res.status(403).json({

        success: false,

        message: "Admin access only.",

    });

}