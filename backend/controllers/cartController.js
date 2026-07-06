import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// =============================
// ADD TO CART
// =============================

export const addToCart = async(req,res)=>{

try{

const{

userId,
productId,
quantity

}=req.body;

const product=

await Product.findById(productId);

if(!product){

return res.status(404).json({

success:false,

message:"Product not found"

});
}
if (product.status !== "Active" || product.stock <= 0) {

    return res.status(400).json({

        success: false,

        message: "Product is out of stock."

    });

}


let cart=

await Cart.findOne({

user:userId

});

if(!cart){

cart=

await Cart.create({

user:userId,

items:[]

});

}

const item=

cart.items.find(

i=>i.product.toString()===productId

);

if (item) {

    const newQuantity = item.quantity + (quantity || 1);

    if (newQuantity > product.stock) {

        return res.status(400).json({

            success: false,

            message: "Insufficient stock."

        });

    }

    item.quantity = newQuantity;

} else {

    if ((quantity || 1) > product.stock) {

        return res.status(400).json({

            success: false,

            message: "Insufficient stock."

        });

    }

    cart.items.push({

        product: productId,

        quantity: quantity || 1,

    });

}

await cart.save();

const updated=

await Cart.findById(cart._id)

.populate("items.product");

res.json({

success:true,

cart:updated

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




// =============================
// GET CART
// =============================

export const getCart=async(req,res)=>{

try{

const cart=

await Cart.findOne({

user:req.params.userId

})

.populate("items.product");

if(!cart){

return res.json({

success:true,

cart:null

});

}

let subtotal=0;

let mrpTotal=0;
cart.items.forEach((item) => {

    if (!item.product) return;

    subtotal += item.product.price * item.quantity;

    mrpTotal += item.product.mrp * item.quantity;

});

const savings=

mrpTotal-subtotal;
const FREE_DELIVERY_LIMIT = 499;

const DELIVERY_CHARGE = 40;

const delivery = subtotal >= FREE_DELIVERY_LIMIT

? 0

: DELIVERY_CHARGE;
const grandTotal=

subtotal+delivery;

res.json({

success:true,

cart,

subtotal,

mrpTotal,

savings,

delivery,

grandTotal


});
}
catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




// =============================
// INCREASE
// =============================

export const increaseQuantity=async(req,res)=>{

try{

const{

userId,

productId

}=req.body;

const cart=

await Cart.findOne({

user:userId

});
if(!cart){

    return res.status(404).json({

        success:false,

        message:"Cart not found."

    });

}
const item=

cart.items.find(

i=>i.product.toString()===productId

);
if(!item){

    return res.status(404).json({

        success:false,

        message:"Item not found."

    });

}
const product = await Product.findById(productId);
if(!product){

    return res.status(404).json({

        success:false,

        message:"Product not found."

    });

}
if(item.quantity >= product.stock){

    return res.status(400).json({

        success:false,

        message:"Maximum stock reached."

    });

}
item.quantity++;

await cart.save();

res.json({

success:true,
message:"Quantity updated."
});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




// =============================
// DECREASE
// =============================

export const decreaseQuantity=async(req,res)=>{

try{

const{

userId,

productId

}=req.body;

const cart=

await Cart.findOne({

user:userId

});
if(!cart){

    return res.status(404).json({

        success:false,

        message:"Cart not found."

    });

}
const item=

cart.items.find(

i=>i.product.toString()===productId

);
if(!item){

    return res.status(404).json({

        success:false,

        message:"Item not found."

    });

}
if(item.quantity>1){

item.quantity--;

}

else{

cart.items=

cart.items.filter(

i=>i.product.toString()!==productId

);

}

await cart.save();

res.json({

success:true,
message:"Quantity updated."
});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




// =============================
// REMOVE
// =============================

export const removeItem=async(req,res)=>{

try{

const{

userId,

productId

}=req.body;

const cart=

await Cart.findOne({

user:userId

});
if(!cart){

    return res.status(404).json({

        success:false,

        message:"Cart not found."

    });

}
const itemExists = cart.items.some(

    item => item.product.toString() === productId

);

if (!itemExists) {

    return res.status(404).json({

        success: false,

        message: "Product not found in cart."

    });

}

cart.items = cart.items.filter(

    item => item.product.toString() !== productId

);
await cart.save();

res.json({

success:true,
message:"Product removed from cart."
});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




// =============================
// CLEAR CART
// =============================

export const clearCart=async(req,res)=>{

try{


const cart = await Cart.findOne({

    user:req.body.userId

});

if(!cart){

    return res.status(404).json({

        success:false,

        message:"Cart not found."

    });

}

cart.items=[];

await cart.save();
res.json({

success:true,
message:"Cart cleared successfully."
});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};