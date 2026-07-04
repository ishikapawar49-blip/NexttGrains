import "./Payment.css";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoReceiptOutline,
  IoTimeOutline,
  IoBagHandleOutline,
  IoLocationOutline,
  IoCardOutline,
  IoHelpCircleOutline,
  IoHomeOutline,
  IoRefreshOutline,
  IoChevronForward,
} from "react-icons/io5";

import { Link, useNavigate, useParams } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const { status } = useParams();

  const success = status === "success";

  // Temporary Dummy Data
  // Later replace with backend order

  const order = {
    id: "NG-98472651",
    amount: 2107,
    subtotal: 2037,
    delivery: 40,
    platform: 20,
    handling: 10,
    discount: 0,
    paymentMethod: "Razorpay",
    deliveryTime: "Today • 7:30 PM",
    address:
      "101, Mahal, Nagpur, Maharashtra",
  };

  return (
    <div className="ngPaymentPage">

      {/* Background */}

      <div className="ngPaymentBgCircle ngPaymentBg1" />
      <div className="ngPaymentBgCircle ngPaymentBg2" />

      <div className="ngPaymentWrapper">

        {/* Left */}

        <div className="ngPaymentLeft">

          {/* Status Card */}

          <div className="ngPaymentHero">

            <div
              className={
                success
                  ? "ngPaymentIcon success"
                  : "ngPaymentIcon failed"
              }
            >
              {success ? (
                <IoCheckmarkCircle />
              ) : (
                <IoCloseCircle />
              )}
            </div>

            <h1>
              {success
                ? "Payment Successful"
                : "Payment Failed"}
            </h1>

            <p>
              {success
                ? "Your payment has been received successfully. Your order is now confirmed and our team has already started preparing it."
                : "We couldn't complete your payment. Don't worry, no money will be deducted if the payment wasn't successful."}
            </p>

            <div className="ngPaymentAmount">
              ₹{order.amount}
            </div>

            <span className="ngPaymentBadge">
              {success
                ? "Order Confirmed"
                : "Payment Pending"}
            </span>

          </div>

          {/* Order Card */}

          <div className="ngPaymentCard">

            <div className="ngPaymentCardHeader">

              <IoReceiptOutline />

              <h3>
                Order Details
              </h3>

            </div>

            <div className="ngPaymentRow">
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </div>

            <div className="ngPaymentRow">
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>

            <div className="ngPaymentRow">
              <span>Status</span>

              <strong
                className={
                  success
                    ? "green"
                    : "red"
                }
              >
                {success
                  ? "Paid"
                  : "Failed"}
              </strong>
            </div>

          </div>

          {/* Timeline */}

          <div className="ngPaymentCard">

            <div className="ngPaymentCardHeader">

              <IoTimeOutline />

              <h3>
                Order Journey
              </h3>

            </div>

            <div className="ngTimeline">

              <div
                className={
                  success
                    ? "ngTimelineItem active"
                    : "ngTimelineItem active"
                }
              >
                <div className="dot" />
                <div>
                  <h4>
                    Payment
                  </h4>
                  <p>
                    {success
                      ? "Payment received"
                      : "Payment failed"}
                  </p>
                </div>
              </div>

              <div
                className={
                  success
                    ? "ngTimelineItem active"
                    : "ngTimelineItem"
                }
              >
                <div className="dot" />
                <div>
                  <h4>
                    Order Confirmed
                  </h4>
                  <p>
                    Seller confirmed your order
                  </p>
                </div>
              </div>

              <div
                className={
                  success
                    ? "ngTimelineItem active"
                    : "ngTimelineItem"
                }
              >
                <div className="dot" />
                <div>
                  <h4>
                    Packed
                  </h4>
                  <p>
                    Fresh organic products packed
                  </p>
                </div>
              </div>

              <div
                className={
                  success
                    ? "ngTimelineItem"
                    : "ngTimelineItem"
                }
              >
                <div className="dot" />
                <div>
                  <h4>
                    Out For Delivery
                  </h4>
                  <p>
                    Delivery partner assigned
                  </p>
                </div>
              </div>

              <div className="ngTimelineItem">
                <div className="dot" />
                <div>
                  <h4>
                    Delivered
                  </h4>
                  <p>
                    Estimated {order.deliveryTime}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="ngPaymentRight">

          {/* Summary */}

          <div className="ngPaymentCard">

            <div className="ngPaymentCardHeader">

              <IoBagHandleOutline />

              <h3>
                Order Summary
              </h3>

            </div>

            <div className="ngPaymentRow">
              <span>Subtotal</span>
              <strong>
                ₹{order.subtotal}
              </strong>
            </div>

            <div className="ngPaymentRow">
              <span>Delivery</span>
              <strong>
                ₹{order.delivery}
              </strong>
            </div>

            <div className="ngPaymentRow">
              <span>Platform Fee</span>
              <strong>
                ₹{order.platform}
              </strong>
            </div>

            <div className="ngPaymentRow">
              <span>Handling</span>
              <strong>
                ₹{order.handling}
              </strong>
            </div>

            <div className="ngPaymentRow">
              <span>Discount</span>
              <strong>
                -₹{order.discount}
              </strong>
            </div>

            <div className="ngPaymentDivider" />

            <div className="ngPaymentRow total">
              <span>Total</span>
              <strong>
                ₹{order.amount}
              </strong>
            </div>

          </div>

          {/* Delivery */}

          <div className="ngPaymentCard">

            <div className="ngPaymentCardHeader">

              <IoLocationOutline />

              <h3>
                Delivery Address
              </h3>

            </div>

            <p className="ngAddressText">
              {order.address}
            </p>

            <div className="ngDeliveryETA">

              <IoTimeOutline />

              Estimated Delivery

              <strong>
                {order.deliveryTime}
              </strong>

            </div>

          </div>

          {/* Support */}

          <div className="ngPaymentCard">

            <div className="ngPaymentCardHeader">

              <IoHelpCircleOutline />

              <h3>
                Need Help?
              </h3>

            </div>

            <div className="ngSupportItem">

              <span>
                Customer Support
              </span>

              <IoChevronForward />

            </div>

            <div className="ngSupportItem">

              <span>
                Download Invoice
              </span>

              <IoChevronForward />

            </div>

          </div>

          {/* Buttons */}

          {success ? (

            <>

              <Link
                to="/orders"
                className="ngPrimaryBtn"
              >
                Track My Order
              </Link>

              <Link
                to="/shop"
                className="ngSecondaryBtn"
              >
                Continue Shopping
              </Link>

            </>

          ) : (

            <>

              <button
                className="ngPrimaryBtn"
                onClick={() => navigate(-1)}
              >
                <IoRefreshOutline />

                Retry Payment

              </button>

              <Link
                to="/cart"
                className="ngSecondaryBtn"
              >
                <IoHomeOutline />

                Back To Cart

              </Link>

            </>

          )}

        </div>

      </div>

    </div>
  );
}