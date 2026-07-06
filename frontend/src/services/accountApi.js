import axios from "axios";

const API = "http://localhost:5000/api";

const getToken = () => {
    return localStorage.getItem("token");
};

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});



// ===============================
// DASHBOARD
// ===============================

export const getDashboard = () => {

    return axios.get(

        `${API}/account/dashboard`,

        authHeader()

    );

};



// ===============================
// UPDATE PROFILE
// ===============================

export const updateProfile = (data) => {

    return axios.put(

        `${API}/account/profile`,

        data,

        authHeader()

    );

};



// ===============================
// UPLOAD IMAGE
// ===============================

export const uploadProfileImage = (data) => {

    return axios.put(

        `${API}/account/profile/image`,

        data,

        authHeader()

    );

};



// ===============================
// REMOVE IMAGE
// ===============================

export const removeProfileImage = () => {

    return axios.delete(

        `${API}/account/profile/image`,

        authHeader()

    );

};



// ===============================
// LOGOUT
// ===============================

export const logout = () => {

    return axios.post(

        `${API}/account/logout`,

        {},

        authHeader()

    );

};