import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

/* ================= ADMIN ================= */

import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminNavbar from "./components/Admin/AdminNavbar";
import Customers from "./pages/Admin/Customer";

/* ================= VENDOR ================= */

import VendorSidebar from "./components/Vendor/VendorSidebar";
// import VendorNavbar from "./components/Vendor/VendorNavbar";
import VendorDashboard from "./pages/Vendor/VendorDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= ADMIN PANEL ================= */}

        <Route
          path="/admin/*"
          element={

            <div className="ngAdminLayout">

              <AdminSidebar />

              <div className="ngAdminRight">

                <AdminNavbar />

                <div className="ngAdminMainContent">

                  <Routes>

                    <Route
                      path="/"
                      element={<Customers />}
                    />

                    <Route
                      path="customers"
                      element={<Customers />}
                    />

                  </Routes>

                </div>

              </div>

            </div>

          }
        />



        {/* ================= VENDOR PANEL ================= */}

        <Route
          path="/vendor/*"
          element={

            <div className="ngVendorLayout">

              <VendorSidebar />

              <div className="ngVendorRight">

                {/* <VendorNavbar/> */}

                <div className="ngVendorMainContent">

                  <Routes>

                    <Route
                      path="/"
                      element={<VendorDashboard />}
                    />

                  </Routes>

                </div>

              </div>

            </div>

          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;