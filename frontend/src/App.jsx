import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import OurStoryPage from "./pages/OurStory/OurStoryPage";
import OffersPage from "./pages/Offers/OfferPage";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {

  return (

    <BrowserRouter>

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