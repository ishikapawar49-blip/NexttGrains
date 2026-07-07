import Product from "../models/Product.js";

const generateProductId = async () => {

    const total = await Product.countDocuments();

    const next = String(total + 1).padStart(6, "0");

    return `NGP-${next}`;

};

export default generateProductId;