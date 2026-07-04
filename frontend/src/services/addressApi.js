import axios from "axios";

const API = "http://localhost:5000";

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

export const updateAddress=async(id,data)=>{

const token=localStorage.getItem("token");

const res=await axios.put(

`${API}/api/address/${id}`,

data,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

return res.data;

}

export const deleteAddress=async(id)=>{

const token=localStorage.getItem("token");

await axios.delete(

`${API}/api/address/${id}`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

}