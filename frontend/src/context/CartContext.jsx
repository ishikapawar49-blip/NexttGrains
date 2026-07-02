import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(null);

    const [cartCount, setCartCount] = useState(0);

    const [cartOpen, setCartOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user?.id;

    // ==========================
    // OPEN / CLOSE SIDEBAR
    // ==========================

    const openCart = () => {

        setCartOpen(true);

    };

    const closeCart = () => {

        setCartOpen(false);

    };

    // ==========================
    // LOAD CART
    // ==========================

    const loadCart = async () => {

        if (!userId) return;

        try {

            const res = await axios.get(

                `http://localhost:5000/api/cart/${userId}`

            );

            setCart(res.data);

            if (res.data.cart) {

                const total = res.data.cart.items.reduce(

                    (sum, item) => sum + item.quantity,

                    0

                );

                setCartCount(total);

            }

            else {

                setCartCount(0);

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    // ==========================
    // ADD TO CART
    // ==========================

    const addToCart = async (productId, quantity = 1) => {

        if (!userId) {

            toast.error("Please login first");

            return;

        }

        try {

            await axios.post(

                "http://localhost:5000/api/cart/add",

                {

                    userId,

                    productId,

                    quantity

                }

            );

            toast.success("Added to Cart");

            await loadCart();

            openCart();

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to add product");

        }

    };

    // ==========================
    // INCREASE
    // ==========================

    const increase = async (productId) => {
await axios.patch(

"http://localhost:5000/api/cart/increase",

{

userId,

productId

}

);

await loadCart();

toast.success("Quantity Updated");

    };

    // ==========================
    // DECREASE
    // ==========================

    const decrease = async (productId) => {

        await axios.patch(

            "http://localhost:5000/api/cart/decrease",

            {

                userId,

                productId

            }

        );

        await loadCart();
        toast.success("Quantity Updated");
    };

    // ==========================
    // REMOVE
    // ==========================

    const removeItem = async (productId) => {

        await axios.delete(

            "http://localhost:5000/api/cart/remove",

            {

                data: {

                    userId,

                    productId

                }

            }

        );

        await loadCart();
        toast.success("Removed from Cart");
    };

    // ==========================
    // CLEAR
    // ==========================

    const clearCart = async () => {

        await axios.delete(

            "http://localhost:5000/api/cart/clear",

            {

                data: {

                    userId

                }

            }

        );

        await loadCart();

    };

    return (

        <CartContext.Provider

           value={

{

cart,

cartCount,

cartOpen,

openCart,

closeCart,

loadCart,

addToCart,

increaseQty: increase,

decreaseQty: decrease,

removeFromCart: removeItem,

clearCart

}

}

        >

            {children}

        </CartContext.Provider>

    );

};

export const useCart = () => useContext(CartContext);