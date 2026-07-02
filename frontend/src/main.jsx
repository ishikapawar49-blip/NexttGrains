import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AddressProvider } from "./context/AddressContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
         <CartProvider>
            <AddressProvider>
        <App />
         
<ToastContainer
position="top-right"
autoClose={2000}
/>
 </AddressProvider>
</CartProvider>
    </React.StrictMode>
);