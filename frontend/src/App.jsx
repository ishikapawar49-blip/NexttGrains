import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { useCart } from "./context/CartContext";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/Shop/ProductDetails";
import OurStoryPage from "./pages/OurStory/OurStoryPage";
import OffersPage from "./pages/Offers/OfferPage";
import Cart from "./pages/Shop/Cart";
import Address from "./pages/Shop/Address";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
const { cartOpen, closeCart} = useCart();   
const [addressOpen, setAddressOpen] = useState(false);

const openAddress = () => {
    closeCart();
    setAddressOpen(true);
};

const closeAddress = () => {
    setAddressOpen(false);
};
           
  return (

    <BrowserRouter>
<Cart
    open={cartOpen}
    onClose={closeCart}
    onCheckout={openAddress}
/>
<Address
    open={addressOpen}
    onClose={closeAddress}
/>

      <Routes>

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* WEBSITE */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <Shop />
            </>
          }
        />
        <Route

path="/product/:id"

element={<ProductDetails/>}

/>
        <Route
          path="/our-story"
          element={
            <>
              <Navbar />
              <OurStoryPage />
            </>
          }
        />

        <Route
          path="/offers"
          element={
            <>
              <Navbar />
              <OffersPage />
            </>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;