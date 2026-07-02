import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getAddresses = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(

        `${API}/api/address`,

        {

            headers: {

                Authorization: `Bearer ${token}`,

            },

        }

    );

    return res.data;

};

export const createAddress = async (data) => {

    const token = localStorage.getItem("token");

    const res = await axios.post(

        `${API}/api/address`,

        data,

        {

            headers: {

                Authorization: `Bearer ${token}`,

            },

        }

    );

    return res.data;

};