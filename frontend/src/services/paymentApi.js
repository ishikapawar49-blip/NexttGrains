import axios from "axios";

const API = "http://localhost:5000";

export const createPaymentOrder = async (paymentData) => {

    const token = localStorage.getItem("token");

    const res = await axios.post(

        `${API}/api/payment/create-order`,

        paymentData,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return res.data;
};

export const verifyPayment = async (paymentData) => {

    const token = localStorage.getItem("token");

    const res = await axios.post(

        `${API}/api/payment/verify`,

        paymentData,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return res.data;
};