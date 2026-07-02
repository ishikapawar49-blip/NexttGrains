import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";

import {
  IoClose,
  IoTrashOutline,
} from "react-icons/io5";
import {
  HiOutlineTruck,
} from "react-icons/hi2";
import {
    FiShield,
    FiPackage,
    FiHeadphones,
    FiMinus,
    FiPlus,
} from "react-icons/fi";
import {
    MdVerified,
     MdOutlineInfo,
} from "react-icons/md";

function Cart({ open, onClose, onCheckout, }) {
  const {
    cart,
    loading,
    loadCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (open) {
      loadCart();
    }
  }, [open]);

  if (!open) return null;
  const handlingCharge = cart?.handlingCharge || 0; 
  const platformFee = cart?.platformFee || 0;
  const subtotal = cart?.subtotal || 0;
  const delivery = cart?.delivery || 0;
  const savings = cart?.savings || 0;

const totalPay= subtotal+ delivery+ handlingCharge+ platformFee;

  const freeLeft = Math.max(
    0,
    cart.freeDeliveryLimit || 499 - subtotal
  );

  return (
    <>
      {/* Overlay */}

      <div
        className="ngCartOverlay"
        onClick={onClose}
      />

      {/* Drawer */}

      <aside className="ngCartDrawer">

        {/* ================= HEADER ================= */}

        <div className="ngCartHeader">

          <h2>
            My Cart
          </h2>

          <button
            className="ngCartCloseBtn"
            onClick={onClose}
          >
            <IoClose />
          </button>

        </div>

        {/* ================= SCROLL AREA ================= */}

        <div className="ngCartScroll">

          {/* Delivery Banner */}

          <div className="ngCartDeliveryBanner">

            <HiOutlineTruck className="ngCartTruckIcon"/>

            {
              freeLeft > 0 ?

              <p>

                Yay! Add items worth

                <b>

                  ₹{freeLeft}

                </b>

                more to get FREE delivery

              </p>

              :

              <p>

                Yay! Free Delivery Unlocked

              </p>

            }

          </div>

          {

          loading ?

          <div className="ngCartLoading">

            Loading...

          </div>

          :

          !cart?.cart ||

          cart.cart.items.length===0 ?

          <div className="ngCartEmpty">

            Your Cart is Empty

          </div>

          :

          <>

          {/* ================= PRODUCTS ================= */}

          <div className="ngCartProducts">

          {

          cart.cart.items.map(item=>(

          <div

          className="ngCartProduct"

          key={item.product._id}

          >

          {/* image */}

          <img

          src={item.product.thumbnail}

          alt={item.product.name}

          className="ngCartProductImage"

          />

          {/* content */}

          <div className="ngCartProductContent">

          <div className="ngCartProductTop">

          <div>

          <h4>

          {item.product.name}

          </h4>

          <p>

          {item.product.quantity}

          {" "}

          {item.product.unit}

          </p>

          </div>

          <button

          className="ngCartDeleteBtn"

          onClick={async()=>{

await removeFromCart(

item.product._id

);

}}

          >

          <IoTrashOutline/>

          </button>

          </div>

          {/* price */}

          <div className="ngCartPriceRow">

          <span className="ngCartPrice">

          ₹{item.product.price}

          </span>

          <span className="ngCartItemTotal">

          ₹

          {

          item.product.price*

          item.quantity

          }

          </span>

          </div>

          {/* quantity */}

          <div className="ngCartQtyRow">

          <div className="ngCartQtyBox">

         <button

onClick={async()=>{

await decreaseQty(

item.product._id

);

}}

>

          <FiMinus/>

          </button>

          <span>

          {item.quantity}

          </span>

          <button

onClick={async()=>{

await increaseQty(

item.product._id

);

}}

>

          <FiPlus/>

          </button>

          </div>

          </div>

          </div>

          </div>

          ))

          }

          </div>
                    {/* ================= BILL DETAILS ================= */}

          <div className="ngCartBillSection">

            <h3 className="ngCartBillTitle">
              Bill details
            </h3>

            <div className="ngCartBillRow">

              <div className="ngCartBillLeft">

                <span>Subtotal

(

{cart.cart.items.length}

Items

)</span>

              </div>

              <strong>

                ₹{subtotal}

              </strong>

            </div>

            <div className="ngCartBillRow">

              <div className="ngCartBillLeft">

                <span>

                  Delivery Charge

                </span>

                <MdOutlineInfo
                  className="ngCartInfoIcon"
                />

              </div>

              <strong>

                ₹{delivery}

              </strong>

            </div>

            <div className="ngCartBillRow">

              <div className="ngCartBillLeft">

                <span>

                  Handling Charge

                </span>

                <MdOutlineInfo
                  className="ngCartInfoIcon"
                />

              </div>

              <strong>

                ₹{handlingCharge}

              </strong>

            </div>

            <div className="ngCartBillRow">

              <div className="ngCartBillLeft">

                <span>

                  Platform Fee

                </span>

                <MdOutlineInfo
                  className="ngCartInfoIcon"
                />

              </div>

              <strong>

                ₹{platformFee}

              </strong>

            </div>

            <div className="ngCartBillDivider"/>

            <div className="ngCartSavingRow">

              <span>

                Total Savings

              </span>

              <strong>

                -₹{savings}

              </strong>

            </div>

          </div>


          {/* ================= TO PAY ================= */}

          <div className="ngCartToPayCard">

            <span>

              To Pay

            </span>

            <h2>

              ₹{totalPay}

            </h2>

          </div>


          {/* ================= CHECKOUT ================= */}
<button
    className="ngCartCheckoutBtn"
    onClick={onCheckout}
>
    Proceed To Checkout
</button>


          {/* ================= SECURE PAYMENT ================= */}

          <div className="ngCartSecurePayment">

            <span>

              🔒

            </span>

            <p>

              100% Secure Payments

            </p>

          </div>


          {/* ================= FEATURES ================= */}
<div className="ngCartFeatureSection">

    <div className="ngCartFeatureItem">

        <FiShield className="ngCartFeatureIcon"/>

        <span>

            Safe &
            <br/>

            Secure

        </span>

    </div>

    <div className="ngCartFeatureDivider"/>

    <div className="ngCartFeatureItem">

        <FiPackage className="ngCartFeatureIcon"/>

        <span>

            Easy
            <br/>

            Returns

        </span>

    </div>

    <div className="ngCartFeatureDivider"/>

    <div className="ngCartFeatureItem">

        <MdVerified className="ngCartFeatureIcon"/>

        <span>

            Quality
            <br/>

            Assured

        </span>

    </div>

    <div className="ngCartFeatureDivider"/>

    <div className="ngCartFeatureItem">

        <FiHeadphones className="ngCartFeatureIcon"/>

        <span>

            24×7
            <br/>

            Support

        </span>

    </div>

</div>
          </>

          }

        </div>

      </aside>

    </>

  );

}

export default Cart;