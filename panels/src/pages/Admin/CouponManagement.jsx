import "./CouponManagement.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTicketAlt,
  FaPercentage,
  FaGift,
} from "react-icons/fa";

import CouponAdd from "./CouponAdd";

const API = "http://localhost:5000/api/coupons";

function CouponManagement() {
  /* =====================================================
      STATES
  ===================================================== */

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState(null);

  const [search, setSearch] = useState("");

  const [couponData, setCouponData] = useState([]);

  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const [stats, setStats] = useState({
    activeCodes: 0,
    redemptions: 0,
    avgDiscount: 0,
    topCoupon: "-",
  });

  /* =====================================================
      FETCH COUPONS
  ===================================================== */

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      const coupons = res.data.data || [];

      setCouponData(coupons);
      setFilteredCoupons(coupons);

      calculateStats(coupons);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      STATS
  ===================================================== */

  const calculateStats = (list) => {
    let active = 0;
    let redemption = 0;
    let totalDiscount = 0;
    let bestCoupon = "-";

    let highestUsage = 0;

    list.forEach((item) => {
      if (item.status === "Active") active++;

      redemption += item.usedCount;

      totalDiscount += item.discountValue;

      if (item.usedCount > highestUsage) {
        highestUsage = item.usedCount;
        bestCoupon = item.couponCode;
      }
    });

    setStats({
      activeCodes: active,
      redemptions: redemption,
      avgDiscount: list.length
        ? Math.round(totalDiscount / list.length)
        : 0,
      topCoupon: bestCoupon,
    });
  };

  /* =====================================================
      SEARCH
  ===================================================== */

  useEffect(() => {
    if (!search) {
      setFilteredCoupons(couponData);
      return;
    }

    const value = search.toLowerCase();

    const result = couponData.filter(
      (coupon) =>
        coupon.couponCode.toLowerCase().includes(value) ||
        coupon.couponName.toLowerCase().includes(value)
    );

    setFilteredCoupons(result);
  }, [search, couponData]);

  /* =====================================================
      INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* =====================================================
      DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!ok) return;

    try {
      await axios.delete(`${API}/delete/${id}`);

      fetchCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  /* =====================================================
      EDIT
  ===================================================== */

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  /* =====================================================
      ADD
  ===================================================== */

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  return (
    <div className="coupon-management">

      {/* ===========================================
            HEADER
      =========================================== */}

      <div className="coupon-header">

        <div>

          <h1>Coupons</h1>

          <p>
            Promotions, codes and campaign performance.
          </p>

        </div>

        <button
          className="coupon-create-btn"
          onClick={handleAddCoupon}
        >
          <FaPlus />

          Create Coupon
        </button>

      </div>

      {/* ===========================================
            STATS
      =========================================== */}

      <div className="coupon-stats">

        <div className="coupon-stat-card">

          <div>

            <span>ACTIVE CODES</span>

            <h2>{stats.activeCodes}</h2>

          </div>

          <div className="coupon-icon green">

            <FaTicketAlt />

          </div>

        </div>

        <div className="coupon-stat-card">

          <div>

            <span>REDEMPTIONS</span>

            <h2>{stats.redemptions}</h2>

          </div>

          <div className="coupon-icon green">

            <FaGift />

          </div>

        </div>

        <div className="coupon-stat-card">

          <div>

            <span>AVG DISCOUNT</span>

            <h2>₹{stats.avgDiscount}</h2>

          </div>

          <div className="coupon-icon yellow">

            <FaPercentage />

          </div>

        </div>

        <div className="coupon-stat-card">

          <div>

            <span>TOP CODE</span>

            <h2>{stats.topCoupon}</h2>

          </div>

          <div className="coupon-icon yellow">

            <FaTicketAlt />

          </div>

        </div>

      </div>

      {/* ===========================================
            SEARCH
      =========================================== */}

      <div className="coupon-search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search coupon code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>
            {/* ===========================================
            TABLE
      =========================================== */}

      <div className="coupon-table-wrapper">

        <table className="coupon-table">

          <thead>

            <tr>

              <th></th>

              <th>CODE</th>

              <th>TYPE</th>

              <th>VALUE</th>

              <th>USED / LIMIT</th>

              <th>EXPIRES</th>

              <th>STATUS</th>

              <th>ACTIONS</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="8" className="coupon-empty">
                  Loading coupons...
                </td>

              </tr>

            ) : filteredCoupons.length === 0 ? (

              <tr>

                <td colSpan="8" className="coupon-empty">
                  No coupons found.
                </td>

              </tr>

            ) : (

              filteredCoupons.map((coupon) => {

                const percent =
                  coupon.usageLimit > 0
                    ? Math.min(
                        (coupon.usedCount / coupon.usageLimit) * 100,
                        100
                      )
                    : 0;

                return (

                  <tr key={coupon._id}>

                    <td>

                      <input type="checkbox" />

                    </td>

                    <td>

                      <span className="coupon-code">

                        {coupon.couponCode}

                      </span>

                    </td>

                    <td>

                      {coupon.couponType}

                    </td>

                    <td>

                      {coupon.couponType === "Flat"
                        ? `₹${coupon.discountValue}`
                        : `${coupon.discountValue}%`}

                    </td>

                    <td>

                      <div className="coupon-usage">

                        <span>

                          {coupon.usedCount} /{" "}

                          {coupon.usageLimit === 0
                            ? "Unlimited"
                            : coupon.usageLimit}

                        </span>

                        {coupon.usageLimit > 0 && (

                          <div className="coupon-progress">

                            <div
                              className="coupon-progress-fill"
                              style={{
                                width: `${percent}%`,
                              }}
                            />

                          </div>

                        )}

                      </div>

                    </td>

                    <td>

                      {new Date(
                        coupon.expiryDate
                      ).toLocaleDateString()}

                    </td>

                    <td>

                      <span
                        className={`coupon-status ${coupon.status.toLowerCase()}`}
                      >

                        {coupon.status}

                      </span>

                    </td>

                    <td>

                      <div className="coupon-actions">

                        <button
                          title="View"
                          className="view-btn"
                          onClick={() =>
                            alert(
                              JSON.stringify(
                                coupon,
                                null,
                                2
                              )
                            )
                          }
                        >

                          <FaEye />

                        </button>

                        <button
                          title="Edit"
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(coupon)
                          }
                        >

                          <FaEdit />

                        </button>

                        <button
                          title="Delete"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(coupon._id)
                          }
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* ===========================================
            FOOTER
      =========================================== */}

      <div className="coupon-footer">

        <span>

          Showing {filteredCoupons.length} of{" "}

          {couponData.length} Coupons

        </span>

        <div className="coupon-pagination">

          <button>

            Previous

          </button>

          <button className="active">

            1

          </button>

          <button>

            Next

          </button>

        </div>

      </div>

      {/* ===========================================
            MODAL
      =========================================== */}

      {showModal && (

        <CouponAdd
          coupon={editingCoupon}
          onClose={() => {
            setShowModal(false);
            setEditingCoupon(null);
          }}
          refreshCoupons={fetchCoupons}
        />

      )}

    </div>
  );
}

export default CouponManagement;