import React from "react";
import "./AdminNavbar.css";

import {
    Search,
    Moon,
    Bell
} from "lucide-react";

const AdminNavbar = () => {

    return (

        <div className="ngAdminNavbar">

            <div className="ngAdminNavbarSearch">

                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search orders, customers, vendors, SKUs..."
                />

            </div>

            <div className="ngAdminNavbarRight">

                <button className="ngAdminNavbarIcon">

                    <Moon size={18} />

                </button>

                <button className="ngAdminNavbarIcon notificationBtn">

                    <Bell size={18} />

                    <span className="ngAdminNavbarDot"></span>

                </button>

                <div className="ngAdminNavbarProfile">

                    <div className="ngAdminNavbarAvatar">
                        AD
                    </div>

                    <div>

                        <h4>Admin User</h4>

                        <span>Super Admin</span>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AdminNavbar;