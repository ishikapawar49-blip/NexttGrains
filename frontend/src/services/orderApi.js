import axios from "axios";

const API = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// ===============================
// GET MY ORDERS
// ===============================

export const getMyOrders = (userId) => {
  return axios.get(
    `${API}/orders/user/${userId}`,
    authHeader()
  );
};

// ===============================
// GET ORDER DETAILS
// ===============================

export const getOrderDetails = (orderId) => {
  return axios.get(
    `${API}/orders/${orderId}`,
    authHeader()
  );
};

// ===============================
// CANCEL ORDER
// ===============================

export const cancelOrder = (orderId, reason) => {
  return axios.put(
    `${API}/orders/cancel/${orderId}`,
    {
      cancelReason: reason
    },
    authHeader()
  );
};