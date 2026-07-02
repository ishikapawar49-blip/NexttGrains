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

if(item){

item.quantity+=quantity || 1;

}

else{

cart.items.push({

product:productId,

quantity:quantity || 1

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

cart.items.forEach(item=>{

subtotal+=

item.product.price*

item.quantity;

mrpTotal+=

item.product.mrp*

item.quantity;

});

const savings=

mrpTotal-subtotal;

const delivery=

subtotal>=499 ? 0 : 40;

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
const handlingCharge = 10;

const platformFee = 2;

const freeDeliveryLimit = 499;

const payableAmount =

subtotal +

delivery +

handlingCharge +

platformFee;

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

const item=

cart.items.find(

i=>i.product.toString()===productId

);

item.quantity++;

await cart.save();

res.json({

success:true

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

const item=

cart.items.find(

i=>i.product.toString()===productId

);

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

success:true

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

cart.items=

cart.items.filter(

i=>i.product.toString()!==productId

);

await cart.save();

res.json({

success:true

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

await Cart.findOneAndUpdate(

{

user:req.body.userId

},

{

items:[]

}

);

res.json({

success:true

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};