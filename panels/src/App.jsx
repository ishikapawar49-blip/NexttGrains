import "./App.css";
import ProductManagement from "./pages/Admin/ProductManagement";
import {
BrowserRouter,
Routes,
Route,
 Navigate 
} from "react-router-dom";

/* ================= ADMIN ================= */
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminNavbar from "./components/Admin/AdminNavbar";
import Customers from "./pages/Admin/Customer";
import OrderManagement from "./pages/Admin/OrderManagement";
import CouponManagement from "./pages/Admin/CouponManagement";

/* ================= VENDOR ================= */
import VendorSidebar from "./components/Vendor/VendorSidebar";
import VendorLogin from "./components/Vendor/VendorLogin";
import VendorSignup from "./components/Vendor/VendorSignup";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import Products from "./pages/Vendor/Products";
import AddProducts from "./pages/Vendor/AddProducts";

function App(){

return(

<BrowserRouter>

<Routes>


{/* ================= ADMIN ================= */}
<Route
path="/admin"
element={<Navigate to="/admin/customers" replace />}
/>
<Route
  path="/admin/customers"
  element={
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <Customers />
        </div>
      </div>
    </div>
  }
/>

<Route
  path="/admin/products"
  element={
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <ProductManagement />
        </div>
      </div>
    </div>
  }
/>
<Route
  path="/admin/orders"
  element={
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <OrderManagement />
        </div>
      </div>
    </div>
  }
/>

<Route
  path="/admin/coupons"
  element={
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <CouponManagement />
        </div>
      </div>
    </div>
  }
/>

{/* ================= VENDOR AUTH ================= */}

<Route

path="/vendor/login"

element={<VendorLogin/>}

/>

<Route

path="/vendor/signup"

element={<VendorSignup/>}

/>


{/* ================= VENDOR DASHBOARD ================= */}

<Route

path="/vendor/dashboard"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<VendorDashboard/>

</div>

</div>

}

/>


{/* ================= PRODUCTS ================= */}

<Route

path="/vendor/products"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<Products/>

</div>

</div>

}

/>


{/* ================= ADD PRODUCT ================= */}

<Route

path="/vendor/products/add"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<AddProducts/>

</div>

</div>

}

/>
<Route

path="/vendor/products/edit/:id"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<AddProducts/>

</div>

</div>

}

/>

</Routes>

</BrowserRouter>

);

}

export default App;