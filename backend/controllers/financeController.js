import Finance from "../models/Finance.js";

/* ==========================================================
   CREATE DEFAULT FINANCE SETTINGS
========================================================== */

export const createFinance = async (req, res) => {

try{

    const alreadyExists = await Finance.findOne();

    if(alreadyExists){

        return res.status(400).json({

            success:false,

            message:"Finance settings already exist."

        });

    }

    const finance = await Finance.create(req.body);

    res.status(201).json({

        success:true,

        message:"Finance settings created successfully.",

        finance

    });

}

catch(error){

    console.error(error);

    res.status(500).json({

        success:false,

        message:"Failed to create finance settings."

    });

}

};

/* ==========================================================
   GET FINANCE SETTINGS
========================================================== */

export const getFinance = async (req, res) => {

try{

    let finance = await Finance.findOne();

    /* ==========================================
       AUTO CREATE DEFAULT DOCUMENT
    ========================================== */

    if(!finance){

        finance = await Finance.create({});

    }

    res.status(200).json({

        success:true,

        finance

    });

}

catch(error){

    console.error(error);

    res.status(500).json({

        success:false,

        message:"Unable to fetch finance settings."

    });

}

};
/* ==========================================================
   UPDATE FINANCE SETTINGS
========================================================== */

export const updateFinance = async (req, res) => {

try{

    const finance = await Finance.findOne();

    if(!finance){

        return res.status(404).json({

            success:false,

            message:"Finance settings not found."

        });

    }

    /* ==========================================
       DELIVERY RULES
    ========================================== */

    if(req.body.deliveryRules){

        finance.deliveryRules = req.body.deliveryRules;

    }

    /* ==========================================
       PLATFORM FEE
    ========================================== */

    if(req.body.platformFee){

        finance.platformFee = {

            ...finance.platformFee.toObject(),

            ...req.body.platformFee

        };

    }

    /* ==========================================
       HANDLING FEE
    ========================================== */

    if(req.body.handlingFee){

        finance.handlingFee = {

            ...finance.handlingFee.toObject(),

            ...req.body.handlingFee

        };

    }

    /* ==========================================
       PACKAGING FEE
    ========================================== */

    if(req.body.packagingFee){

        finance.packagingFee = {

            ...finance.packagingFee.toObject(),

            ...req.body.packagingFee

        };

    }

    /* ==========================================
       RAIN FEE
    ========================================== */

    if(req.body.rainFee){

        finance.rainFee = {

            ...finance.rainFee.toObject(),

            ...req.body.rainFee

        };

    }

    /* ==========================================
       SURGE FEE
    ========================================== */

    if(req.body.surgeFee){

        finance.surgeFee = {

            ...finance.surgeFee.toObject(),

            ...req.body.surgeFee

        };

    }

    /* ==========================================
       GST
    ========================================== */

    if(req.body.gst){

        finance.gst = {

            ...finance.gst.toObject(),

            ...req.body.gst

        };

    }

    /* ==========================================
       VENDOR SETTINGS
    ========================================== */

    if(req.body.vendorSettings){

        finance.vendorSettings = {

            ...finance.vendorSettings.toObject(),

            ...req.body.vendorSettings

        };

    }
        /* ==========================================
       COD
    ========================================== */

    if(req.body.codCharge!==undefined){

        finance.codCharge = req.body.codCharge;

    }

    if(req.body.codMinimumOrder!==undefined){

        finance.codMinimumOrder = req.body.codMinimumOrder;

    }

    /* ==========================================
       CANCELLATION
    ========================================== */

    if(req.body.cancellationCharge){

        finance.cancellationCharge = {

            ...finance.cancellationCharge.toObject(),

            ...req.body.cancellationCharge

        };

    }

    /* ==========================================
       RETURN
    ========================================== */

    if(req.body.returnCharge){

        finance.returnCharge = {

            ...finance.returnCharge.toObject(),

            ...req.body.returnCharge

        };

    }

    /* ==========================================
       REFUND
    ========================================== */

    if(req.body.refundProcessingFee){

        finance.refundProcessingFee = {

            ...finance.refundProcessingFee.toObject(),

            ...req.body.refundProcessingFee

        };

    }

    /* ==========================================
       WALLET
    ========================================== */

    if(req.body.walletSettings){

        finance.walletSettings = {

            ...finance.walletSettings.toObject(),

            ...req.body.walletSettings

        };

    }

    /* ==========================================
       INVOICE
    ========================================== */

    if(req.body.invoicePrefix!==undefined){

        finance.invoicePrefix = req.body.invoicePrefix;

    }

    if(req.body.invoiceFooter!==undefined){

        finance.invoiceFooter = req.body.invoiceFooter;

    }

    /* ==========================================
       ACTIVE
    ========================================== */

    if(req.body.active!==undefined){

        finance.active = req.body.active;

    }

    /* ==========================================
       UPDATED BY
    ========================================== */

    if(req.user){

        finance.updatedBy = req.user._id;

    }

    await finance.save();

    res.status(200).json({

        success:true,

        message:"Finance settings updated successfully.",

        finance

    });

}

catch(error){

    console.error(error);

    res.status(500).json({

        success:false,

        message:"Unable to update finance settings."

    });

}

};

/* ==========================================================
   CALCULATE CHECKOUT CHARGES
========================================================== */

export const calculateCharges = async (req, res) => {

try{

    const subtotal = Number(req.query.subtotal || 0);

    const finance = await Finance.findOne();

    if(!finance){

        return res.status(404).json({

            success:false,

            message:"Finance settings not found."

        });

    }

    /* ==========================================
       DELIVERY CHARGE
    ========================================== */

    let deliveryCharge = 0;

    let freeDelivery = false;

    const matchedRule = finance.deliveryRules.find((rule)=>{

        return (

            subtotal >= rule.minAmount &&

            subtotal <= rule.maxAmount

        );

    });

    if(matchedRule){

        deliveryCharge = matchedRule.deliveryCharge;

        freeDelivery = matchedRule.freeDelivery;

    }

    /* ==========================================
       PLATFORM FEE
    ========================================== */

    let platformFee = 0;

    if(

        finance.platformFee.enabled &&

        subtotal >= finance.platformFee.minimumOrder

    ){

        if(

            finance.platformFee.feeType==="Flat"

        ){

            platformFee = finance.platformFee.amount;

        }

        else{

            platformFee =

            subtotal *

            finance.platformFee.amount /

            100;

        }

        if(

            platformFee >

            finance.platformFee.maximumFee

        ){

            platformFee =

            finance.platformFee.maximumFee;

        }

    }

    /* ==========================================
       HANDLING FEE
    ========================================== */

    let handlingFee = 0;

    if(

        finance.handlingFee.enabled &&

        subtotal >= finance.handlingFee.minimumOrder

    ){

        if(

            finance.handlingFee.feeType==="Flat"

        ){

            handlingFee =

            finance.handlingFee.amount;

        }

        else{

            handlingFee =

            subtotal *

            finance.handlingFee.amount /

            100;

        }

    }

        /* ==========================================
       PACKAGING FEE
    ========================================== */

    let packagingFee = 0;

    if(finance.packagingFee.enabled){

        packagingFee = finance.packagingFee.amount;

    }

    /* ==========================================
       RAIN FEE
    ========================================== */

    let rainFee = 0;

    if(finance.rainFee.enabled){

        rainFee = finance.rainFee.amount;

    }

    /* ==========================================
       SURGE FEE
    ========================================== */

    let surgeFee = 0;

    if(finance.surgeFee.enabled){

        surgeFee = finance.surgeFee.amount;

    }

    /* ==========================================
       SUB TOTAL AFTER CHARGES
    ========================================== */

    const taxableAmount =

        subtotal +

        deliveryCharge +

        platformFee +

        handlingFee +

        packagingFee +

        rainFee +

        surgeFee;

    /* ==========================================
       GST
    ========================================== */

    let gstAmount = 0;

    if(finance.gst.enabled){

        gstAmount =

        Number(

            (

                taxableAmount *

                finance.gst.percentage /

                100

            ).toFixed(2)

        );

    }

    /* ==========================================
       GRAND TOTAL
    ========================================== */

    const grandTotal = Number(

        (

            taxableAmount +

            gstAmount

        ).toFixed(2)

    );

    /* ==========================================
       RESPONSE
    ========================================== */

    return res.status(200).json({

        success:true,

        charges:{

            subtotal,

            deliveryCharge,

            freeDelivery,

            platformFee,

            handlingFee,

            packagingFee,

            rainFee,

            surgeFee,

            gstPercentage:

            finance.gst.percentage,

            gstAmount,

            grandTotal

        },

        finance

    });

}

catch(error){

    console.error(error);

    return res.status(500).json({

        success:false,

        message:"Unable to calculate charges."

    });

}

};