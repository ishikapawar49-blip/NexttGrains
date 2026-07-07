import "./CouponAdd.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTimes,
  FaTicketAlt,
  FaPercent,
  FaRupeeSign,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";

const API = "http://localhost:5000/api/coupons";

function CouponAdd({
  coupon,
  onClose,
  refreshCoupons,
}) {
  /* ======================================================
      STATE
  ====================================================== */

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    couponCode: "",
    couponName: "",
    description: "",
    couponType: "Flat",
    discountValue: "",
    maxDiscount: "",
    minimumOrderAmount: "",
    maximumOrderAmount: "",
    usageLimit: "",
    perUserLimit: 1,
    firstOrderOnly: false,
    startDate: "",
    expiryDate: "",
    status: "Active",
    couponImage: "",
    bannerImage: "",
    adminRemark: "",
  });

  /* ======================================================
      EDIT MODE
  ====================================================== */

  useEffect(() => {
    if (!coupon) return;

    setFormData({
      couponCode: coupon.couponCode || "",
      couponName: coupon.couponName || "",
      description: coupon.description || "",
      couponType: coupon.couponType || "Flat",
      discountValue: coupon.discountValue || "",
      maxDiscount: coupon.maxDiscount || "",
      minimumOrderAmount:
        coupon.minimumOrderAmount || "",
      maximumOrderAmount:
        coupon.maximumOrderAmount || "",
      usageLimit: coupon.usageLimit || "",
      perUserLimit: coupon.perUserLimit || 1,
      firstOrderOnly:
        coupon.firstOrderOnly || false,

      startDate: coupon.startDate
        ? coupon.startDate.slice(0, 10)
        : "",

      expiryDate: coupon.expiryDate
        ? coupon.expiryDate.slice(0, 10)
        : "",

      status: coupon.status || "Active",

      couponImage: coupon.couponImage || "",

      bannerImage: coupon.bannerImage || "",

      adminRemark: coupon.adminRemark || "",
    });
  }, [coupon]);

  /* ======================================================
      HANDLE CHANGE
  ====================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ======================================================
      SUBMIT
  ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (coupon) {
        await axios.put(
          `${API}/update/${coupon._id}`,
          formData
        );
      } else {
        await axios.post(
          `${API}/create`,
          formData
        );
      }

      refreshCoupons();

      onClose();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-modal-overlay">

      <div className="coupon-modal">

        {/* ======================================= */}

        <div className="coupon-modal-header">

          <h2>

            <FaTicketAlt />

            {coupon
              ? "Edit Coupon"
              : "Create Coupon"}

          </h2>

          <button
            onClick={onClose}
            className="coupon-close-btn"
          >
            <FaTimes />
          </button>

        </div>

        {/* ======================================= */}

        <form
          onSubmit={handleSubmit}
          className="coupon-form"
        >
                  {/* ==========================================
                ROW 1
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>Coupon Code *</label>

              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="WELCOME50"
                required
              />

            </div>

            <div className="coupon-field">

              <label>Coupon Name *</label>

              <input
                type="text"
                name="couponName"
                value={formData.couponName}
                onChange={handleChange}
                placeholder="Welcome Offer"
                required
              />

            </div>

          </div>

          {/* ==========================================
                DESCRIPTION
          ========================================== */}

          <div className="coupon-field">

            <label>Description</label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Coupon description..."
            />

          </div>

          {/* ==========================================
                ROW 2
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>

                <FaPercent />

                Coupon Type

              </label>

              <select
                name="couponType"
                value={formData.couponType}
                onChange={handleChange}
              >

                <option value="Flat">
                  Flat
                </option>

                <option value="Percentage">
                  Percentage
                </option>

              </select>

            </div>

            <div className="coupon-field">

              <label>

                <FaRupeeSign />

                Discount Value

              </label>

              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* ==========================================
                ROW 3
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>

                Maximum Discount

              </label>

              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
              />

            </div>

            <div className="coupon-field">

              <label>

                Usage Limit

              </label>

              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ==========================================
                ROW 4
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>

                Minimum Order Amount

              </label>

              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
              />

            </div>

            <div className="coupon-field">

              <label>

                Maximum Order Amount

              </label>

              <input
                type="number"
                name="maximumOrderAmount"
                value={formData.maximumOrderAmount}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ==========================================
                ROW 5
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>

                Per User Limit

              </label>

              <input
                type="number"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
              />

            </div>

            <div className="coupon-field">

              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Expired">
                  Expired
                </option>

              </select>

            </div>

          </div>

          {/* ==========================================
                CHECKBOX
          ========================================== */}

          <div className="coupon-checkbox">

            <label>

              <input
                type="checkbox"
                name="firstOrderOnly"
                checked={formData.firstOrderOnly}
                onChange={handleChange}
              />

              First Order Only

            </label>

          </div>

          {/* ==========================================
                DATE
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>

                <FaCalendarAlt />

                Start Date

              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

            </div>

            <div className="coupon-field">

              <label>

                <FaCalendarAlt />

                Expiry Date

              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>
                    {/* ==========================================
                IMAGES
          ========================================== */}

          <div className="coupon-form-grid">

            <div className="coupon-field">

              <label>Coupon Image URL</label>

              <input
                type="text"
                name="couponImage"
                value={formData.couponImage}
                onChange={handleChange}
                placeholder="https://..."
              />

            </div>

            <div className="coupon-field">

              <label>Banner Image URL</label>

              <input
                type="text"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="https://..."
              />

            </div>

          </div>

          {/* ==========================================
                ADMIN REMARK
          ========================================== */}

          <div className="coupon-field">

            <label>Admin Remark</label>

            <textarea
              rows="4"
              name="adminRemark"
              value={formData.adminRemark}
              onChange={handleChange}
              placeholder="Internal note..."
            />

          </div>

          {/* ==========================================
                FOOTER BUTTONS
          ========================================== */}

          <div className="coupon-footer-buttons">

            <button
              type="button"
              className="coupon-cancel-btn"
              onClick={onClose}
            >

              Cancel

            </button>

            <button
              type="submit"
              className="coupon-save-btn"
              disabled={loading}
            >

              <FaSave />

              {loading
                ? "Saving..."
                : coupon
                ? "Update Coupon"
                : "Save Coupon"}

            </button>

          </div>

        </form>

      </div>

   </div>
  );
}

export default CouponAdd;