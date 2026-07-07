import axios from "./axios";
export const getCustomers=()=>{

return axios.get(

"/customers"

);

};
export const getCustomer=(id)=>{

return axios.get(

`/customers/${id}`

);

};
export const updateCustomer=(id,data)=>{

return axios.put(

`/customers/${id}`,

data

);

};
export const toggleBlockCustomer=(id)=>{

return axios.put(

`/customers/block/${id}`

);

};
export const deleteCustomer = (id) => {

    return axios.delete(

        `/customers/${id}`

    );

};
export const exportExcel = () => {

    return axios.get(

        "/customers/export/excel",

        {

            responseType: "blob"

        }

    );

};

export const exportPDF = () => {

    return axios.get(

        "/customers/export/pdf",

        {

            responseType: "blob"

        }

    );

};