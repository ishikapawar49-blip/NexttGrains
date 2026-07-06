import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getWishlist,
    toggleWishlist,
} from "../services/wishlistApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

    const [wishlist,setWishlist] = useState([]);

    const [wishlistCount,setWishlistCount] = useState(0);

    const token = localStorage.getItem("token");

    useEffect(()=>{

        if(token){

            loadWishlist();

        }

    },[]);

    const loadWishlist = async()=>{

        try{

            const res = await getWishlist();

            const data = res.data.products || [];

            setWishlist(data);

            setWishlistCount(data.length);

        }

        catch(err){

            console.log(err);

        }

    };

    const toggle = async(productId)=>{

        try{

            const res = await toggleWishlist(productId);

            if(res.data.action==="added"){

                toast.success("Added to Wishlist");

            }

            else{

                toast.success("Removed from Wishlist");

            }

            await loadWishlist();

        }

        catch(err){

            console.log(err);

        }

    };

    const isWishlisted = (productId)=>{

        return wishlist.some(

            item=>item.product._id===productId

        );

    };

    return(

        <WishlistContext.Provider

        value={{

            wishlist,

            wishlistCount,

            loadWishlist,

            toggleWishlist:toggle,

            isWishlisted

        }}

        >

            {children}

        </WishlistContext.Provider>

    );

};

export const useWishlist=()=>useContext(WishlistContext);