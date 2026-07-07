import User from "../models/User.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import Wishlist from "../models/Wishlist.js";
import Cart from "../models/Cart.js";

import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
// ======================================
// GET ALL CUSTOMERS
// ======================================

export const getCustomers = async (req, res) => {

  try {

    const users = await User.find({
      role: "customer"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const customers = await Promise.all(

      users.map(async (user) => {

        const orders = await Order.find({
          user: user._id
        });

        const address = await Address.findOne({
          user: user._id
        });

        const spent = orders.reduce(
          (sum, order) => sum + order.grandTotal,
          0
        );

        let segment = "New";

        if (orders.length >= 10) {
          segment = "VIP";
        }
        else if (orders.length >= 3) {
          segment = "Active";
        }

        return {

          _id: user._id,

          name: user.name,

          email: user.email,

          phone: user.phone,

          city: address?.city || "-",

          orders: orders.length,

          spent,

          segment,

          joined: user.createdAt,

          isBlocked: user.isBlocked

        };

      })

    );

    res.json({

      success: true,

      customers

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};


// ======================================
// GET SINGLE CUSTOMER
// ======================================

export const getCustomer = async (req, res) => {

  try {

    const customer = await User.findById(req.params.id)
      .select("-password");

    res.json({

      success: true,

      customer

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};


// ======================================
// UPDATE CUSTOMER
// ======================================

export const updateCustomer = async (req, res) => {

  try {

    const customer = await User.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true
      }

    ).select("-password");

    res.json({

      success: true,

      customer

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};


// ======================================
// BLOCK / UNBLOCK
// ======================================

export const toggleBlockCustomer = async (req, res) => {

    try {

        const customer = await User.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({
                success:false,
                message:"Customer not found"
            });

        }

        customer.isBlocked = !customer.isBlocked;

        await customer.save();

        res.json({

            success:true,
            message:"Status Updated",
            customer

        });

    }

    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

};
export const deleteCustomer = async (req, res) => {

    try {

        const customer = await User.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found"

            });

        }

        // Related data delete
        await Wishlist.deleteOne({
            user: customer._id
        });

        await Cart.deleteOne({
            user: customer._id
        });

        await Address.deleteMany({
            user: customer._id
        });

        // User delete
        await User.findByIdAndDelete(customer._id);

        res.json({

            success: true,

            message: "Customer deleted successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
export const exportCustomersExcel = async (req, res) => {

    const users = await User.find({
        role: "customer"
    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Customers");

    sheet.columns = [

        { header: "Name", key: "name", width: 25 },

        { header: "Email", key: "email", width: 30 },

        { header: "Phone", key: "phone", width: 18 },

        { header: "City", key: "city", width: 20 },

        { header: "Orders", key: "orders", width: 12 },

        { header: "Spent", key: "spent", width: 15 },

        { header: "Status", key: "status", width: 15 },

        { header: "Joined", key: "joined", width: 18 }

    ];

    for (const user of users) {

        const address = await Address.findOne({
            user: user._id
        });

        const orders = await Order.find({
            user: user._id
        });

        const spent = orders.reduce(

            (sum, o) => sum + o.grandTotal,

            0

        );

        sheet.addRow({

            name: user.name,

            email: user.email,

            phone: user.phone,

            city: address?.city || "-",

            orders: orders.length,

            spent,

            status: user.isBlocked ? "Blocked" : "Active",

            joined: user.createdAt.toLocaleDateString()

        });

    }

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        "attachment; filename=customers.xlsx"

    );

    await workbook.xlsx.write(res);

    res.end();

};
export const exportCustomersPDF = async (req, res) => {

    console.log("PDF API HIT");

    try {

        const users = await User.find({ role: "customer" });

       const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
});

        const rows = [];

        for (const user of users) {

            const address = await Address.findOne({
                user: user._id
            });

            const orders = await Order.find({
                user: user._id
            });

            const spent = orders.reduce(
                (sum, o) => sum + o.grandTotal,
                0
            );

           let segment = "New";

if (orders.length >= 10) {
    segment = "VIP";
} else if (orders.length >= 3) {
    segment = "Active";
}

rows.push([
    user.name,
    user.email,
    user.phone || "-",
    address?.city || "-",
    orders.length,
    `₹${spent}`,
    user.isBlocked ? "Blocked" : segment,
    new Date(user.createdAt).toLocaleDateString("en-IN")
]);
        }

       doc.setFontSize(18);

doc.setTextColor(47,75,29);

doc.text(
    "NexttGrains Customers Report",
    148,
    15,
    { align: "center" }
);

autoTable(doc, {
    startY: 25,

    head: [[
        "Name",
        "Email",
        "Phone",
        "City",
        "Orders",
        "Spent",
        "Segment",
        "Joined"
    ]],

    body: rows,

    theme: "grid",

    tableWidth: "auto",

    styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle"
    },

    headStyles: {
        fillColor: [47, 75, 29],
        textColor: 255,
        fontStyle: "bold",
        halign: "center"
    },

    bodyStyles: {
        halign: "center"
    },

    alternateRowStyles: {
        fillColor: [245,245,245]
    },

    margin: {
        top: 20,
        left: 10,
        right: 10
    }
});
        const pdf = doc.output("arraybuffer");

        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=Customers.pdf",
            "Content-Length": pdf.byteLength
        });

        res.end(Buffer.from(pdf));

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};