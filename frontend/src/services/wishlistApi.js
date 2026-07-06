import axios from "axios";

const API = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// =====================
// GET WISHLIST
// =====================

export const getWishlist = () =>
  axios.get(`${API}/wishlist`, authHeader());

// =====================
// TOGGLE WISHLIST
// =====================

export const toggleWishlist = (productId) =>
  axios.post(
    `${API}/wishlist/toggle`,
    { productId },
    authHeader()
  );

// =====================
// REMOVE ITEM
// =====================

export const removeWishlistItem = (productId) =>
  axios.delete(
    `${API}/wishlist/${productId}`,
    authHeader()
  );

// =====================
// CLEAR WISHLIST
// =====================

export const clearWishlist = () =>
  axios.delete(
    `${API}/wishlist`,
    authHeader()
  );