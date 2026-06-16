import Customer from "../models/Customer.js";

export const getCustomers=async(req,res)=>{

const customers=await Customer.find();

res.json(customers);

};

export const addCustomer=async(req,res)=>{

const customer=new Customer(req.body);

await customer.save();

res.json(customer);

};

export const deleteCustomer=async(req,res)=>{

await Customer.findByIdAndDelete(req.params.id);

res.json({
message:"deleted"
});

};

export const updateCustomer=async(req,res)=>{

await Customer.findByIdAndUpdate(
req.params.id,
req.body
);

res.json({
message:"updated"
});

};