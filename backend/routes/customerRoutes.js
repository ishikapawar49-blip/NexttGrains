import express from "express";

import {

getCustomers,
addCustomer,
deleteCustomer,
updateCustomer

}

from "../controllers/customerController.js";

const router=express.Router();

router.get("/",getCustomers);

router.post("/",addCustomer);

router.put("/:id",updateCustomer);

router.delete("/:id",deleteCustomer);

export default router;