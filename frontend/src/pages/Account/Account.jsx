import "./Account.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getDashboard,
    logout,
} from "../../services/accountApi";
import {
  IoCubeOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoTicketOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoChevronForward,
  IoBagHandleOutline,
  IoSparklesOutline,
  IoArrowForward,
  IoCheckmarkCircle,
  IoWalletOutline,
  IoTimeOutline,
} from "react-icons/io5";

export default function Account() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState({});
const [profile, setProfile] = useState({

    avatar: "",

    name: "",

    phone: "",

});

const [stats, setStats] = useState({

    orders: 0,

    wishlist: 0,

    wallet: 0,

    saved: 0,

})
const [recentOrders,setRecentOrders]=useState([]);

const [recommended,setRecommended]=useState([]);

const [loading,setLoading]=useState(true);

const fetchAccount = async () => {

    try {

        const token = localStorage.getItem("token");

const res = await getDashboard();
           console.log(res.data);
        const data = res.data.data;

        setProfile(data.profile);

        setStats(data.stats);

        setRecentOrders(data.recentOrders);

        setRecommended(data.recommendedProducts);

        setInsights(data.insights);

        setLoading(false);

    }

    catch (err) {

        console.log(err);

        setLoading(false);

    }

};
const handleLogout = async () => {

    try{

        await logout();

    }

    catch(err){

        console.log(err);

    }

    localStorage.removeItem("token");

    navigate("/login");

};

useEffect(()=>{
fetchAccount();
},[]);
if (loading) {

    return (

        <div className="ngAcc_loading">

            Loading...

        </div>

    );

}
  return (
    <div className="ngAcc_page">

      <div className="ngAcc_wrapper">

        {/* ================= LEFT SIDEBAR ================= */}

        <aside className="ngAcc_sidebar">

          {/* Profile */}

          <div className="ngAcc_profileCard">

            <img
              src={
    profile.profileImage ||
    "https://ui-avatars.com/api/?name=User"
              }
              alt=""
              className="ngAcc_avatar"
            />

            <div>

              <h2>{profile.name}</h2>

              <p>{profile.phone}</p>

            </div>

          </div>

          {/* Menu */}

          <div className="ngAcc_menu">

            <div
              className="ngAcc_menuItem"
              onClick={() => navigate("/orders")}
            >

              <div>

                <IoCubeOutline />

                <span>My Orders</span>

              </div>

              <strong>{stats.orders}</strong>

            </div>

            <div
              className="ngAcc_menuItem"
              onClick={() => navigate("/wishlist")}
            >

              <div>

                <IoHeartOutline />

                <span>Wishlist</span>

              </div>

              <strong>{stats.wishlist}</strong>

            </div>

            <div
              className="ngAcc_menuItem"
              onClick={() => navigate("/addresses")}
            >

              <div>

                <IoLocationOutline />

                <span>Addresses</span>

              </div>

              <strong>{stats.addresses}</strong>

            </div>


            <div
              className="ngAcc_menuItem"
              onClick={() => navigate("/coupons")}
            >

              <div>

                <IoTicketOutline />

                <span>Coupons</span>

              </div>

              <strong>{stats.coupons}</strong>

            </div>

            <div
              className="ngAcc_menuItem"
              onClick={() => navigate("/notifications")}
            >

              <div>

                <IoNotificationsOutline />

                <span>Notifications</span>

              </div>

              <strong>{stats.notifications}</strong>

            </div>

          </div>

          {/* Logout */}

          <button className="ngAcc_logoutBtn" onClick={handleLogout}>

            <IoLogOutOutline />

            Sign out

          </button>

        </aside>
                {/* ================= RIGHT ================= */}

        <main className="ngAcc_content">

          {/* Hero */}

          <section className="ngAcc_hero">

            <div>

              <h1>
Hello, {profile.name ? profile.name.split(" ")[0] : "User"} 👋              </h1>

              <p>
                Here's what's happening with your pantry.
              </p>

            </div>

          </section>

          {/* Stats */}

          <section className="ngAcc_stats">

            <div className="ngAcc_statCard">

              <span>Orders</span>

              <h2>{stats.orders}</h2>

              <p>this year</p>

            </div>

            <div className="ngAcc_statCard">

              <span>Saved</span>

              <h2>{stats.saved}</h2>

              <p>lifetime</p>

            </div>

          </section>

          {/* ================= RECENT ORDERS ================= */}

          <section className="ngAcc_recentOrdersSection">

            <div className="ngAcc_sectionHeader">

              <h2>Recent Orders</h2>

              <button
                className="ngAcc_viewAllBtn"
                onClick={() => navigate("/orders")}
              >

                View All

                <IoArrowForward />

              </button>

            </div>

            <div className="ngAcc_recentOrders">

              {recentOrders.map((order) => (

                <div
                  className="ngAcc_recentOrderCard"
                  key={order._id}
                >

                  <div className="ngAcc_recentOrderLeft">

                    <div className="ngAcc_recentOrderIcon">

                      <IoBagHandleOutline />

                    </div>

                    <div>

                      <h3>
                       Order #{order.orderNumber}
                      </h3>

                      <p>
                       {order.totalItems} items · Delivered {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                  <div className="ngAcc_recentOrderRight">

                    <span
                      className={
                        order.orderStatus === "Delivered"
                          ? "ngAcc_status ngAcc_statusDelivered"
                          : order.orderStatus === "Packed"
                          ? "ngAcc_status ngAcc_statusPacked"
                          : "ngAcc_status ngAcc_statusDelivery"
                      }
                    >

                      {order.orderStatus}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          </section>
                    {/* ================= RECOMMENDED ================= */}

          <section className="ngAcc_recommendedSection">

            <div className="ngAcc_sectionHeader">

              <h2>
                Recommended For You
              </h2>

              <button
                className="ngAcc_viewAllBtn"
                onClick={() => navigate("/shop")}
              >

                Explore

                <IoArrowForward />

              </button>

            </div>

            <div className="ngAcc_recommendedGrid">

              {recommended.map((item) => (

                <div
                  className="ngAcc_recommendedCard"
                  key={item._id}
                >

                  <img
                    src={item.thumbnail}
                    alt={item.name}
                  />

                  <div className="ngAcc_recommendedContent">

                    <span className="ngAcc_organicTag">

                      <IoSparklesOutline />

                      Organic

                    </span>

                    <h3>

                      {item.name}

                    </h3>

                    <div className="ngAcc_recommendedBottom">

                      <h2>

                        ₹{item.price}

                      </h2>

                      <button>

                        Add

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="ngAcc_quickActionSection">

            <div className="ngAcc_sectionHeader">

              <h2>

                Quick Actions

              </h2>

            </div>

            <div className="ngAcc_quickActionGrid">

              <div
                className="ngAcc_quickCard"
                onClick={() => navigate("/addresses")}
              >

                <IoLocationOutline />

                <h4>

                  Saved Addresses

                </h4>

                <p>

                  Manage delivery locations

                </p>

              </div>

              <div
                className="ngAcc_quickCard"
                onClick={() => navigate("/wishlist")}
              >

                <IoHeartOutline />

                <h4>

                  Wishlist

                </h4>

                <p>

                  Saved favourite products

                </p>

              </div>

              <div
                className="ngAcc_quickCard"
                onClick={() => navigate("/coupons")}
              >

                <IoTicketOutline />

                <h4>

                  Coupons

                </h4>

                <p>

                  View available offers

                </p>

              </div>

            </div>

          </section>
                    {/* ================= MEMBERSHIP ================= */}

          {/* ================= ACCOUNT INSIGHTS ================= */}

          <section className="ngAcc_insightsSection">

            <div className="ngAcc_sectionHeader">

              <h2>

                Account Insights

              </h2>

            </div>

            <div className="ngAcc_insightGrid">

              <div className="ngAcc_insightCard">

                <IoCheckmarkCircle />

                <h3>

                  Orders Delivered

                </h3>

<strong>{insights.ordersDelivered || 0}</strong>

                <p>

                  Successfully delivered

                </p>

              </div>

              <div className="ngAcc_insightCard">

                <IoTimeOutline />

                <h3>

                  Standard Shipping

                </h3>

                <strong>

                  5-7 Business Days

                </strong>
                <p>
                    Fresh organic products delivered across India.
                </p>
              </div>

              <div className="ngAcc_insightCard">

                <IoWalletOutline />

                <h3>

                  Cashback Earned

                </h3>
<strong>₹{insights.cashbackEarned || 0}</strong>

                <p>

                  Total rewards received

                </p>

              </div>

            </div>

          </section>

          {/* ================= BOTTOM CTA ================= */}

          <section className="ngAcc_accountBottom">

            <div className="ngAcc_accountBottomCard">

              <div>

                <h2>

                  Continue Your Healthy Journey

                </h2>

                <p>

                  Explore fresh organic grains, cold-pressed oils,
                  spices and naturally grown products curated
                  specially for you.

                </p>

              </div>

              <button
                className="ngAcc_shopNowBtn"
                onClick={() => navigate("/shop")}
              >

                Shop Now

                <IoChevronForward />

              </button>

            </div>

          </section>

        </main>

      </div>

    </div>

  );
}