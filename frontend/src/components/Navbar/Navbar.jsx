import "./Navbar.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  MapPin,
} from "lucide-react";
import { PiLeafLight } from "react-icons/pi";

function Navbar() {
const {

cartCount,

openCart,

loadCart

}=useCart();

const {

wishlistCount

}=useWishlist();

useEffect(()=>{
   loadCart(); 
},[]);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-circle">
            <PiLeafLight className="leaf-icon" />
          </div>

          <div className="logo-content">
            <h1 className="logo-title">
              Nextt<span>Grains</span>
            </h1>

            <div className="delivery-text">
              <MapPin size={13} />
              <span>Delivering to Bengaluru · 24 hrs</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" />

          <input
            type="text"
            placeholder='Search "organic atta", "cold-pressed oil"...'
          />
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/shop">Shop</Link>

  <Link to="/categories">
    Categories
  </Link>

  <Link to="/offers">
    Offers
  </Link>

  <Link to="/our-story">
    Our Story
  </Link>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <Link
  to="/account"
  className="icon-btn"
>
  <User />
</Link>

<Link

to="/wishlist"

className="icon-btn"

>

<Heart/>
</Link>

<button
className="cart-btn"
onClick={openCart}
>
<ShoppingCart />
<span>Cart</span>
<strong>{cartCount}</strong>
</button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;