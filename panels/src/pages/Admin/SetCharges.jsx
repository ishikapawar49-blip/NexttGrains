import "./SetCharges.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {

FaTimes,

FaSave,

FaTruck,

FaWallet,

FaMoneyBillWave,

FaBoxOpen,

FaCloudRain,

FaBolt,

FaPercentage,

FaStore,

FaMoneyCheckAlt,

FaUndo,

FaFileInvoiceDollar,

FaPlus,

FaTrash

} from "react-icons/fa";

const API="http://localhost:5000/api/finance";

function SetCharges({

finance,

refreshFinance,

onClose

}){

const[loading,setLoading]=useState(false);

const[formData,setFormData]=useState({

deliveryRules:[

{

minAmount:0,

maxAmount:149,

deliveryCharge:80,

freeDelivery:false

},

{

minAmount:150,

maxAmount:399,

deliveryCharge:30,

freeDelivery:false

},

{

minAmount:400,

maxAmount:999999,

deliveryCharge:0,

freeDelivery:true

}

],

platformFee:{

enabled:true,

feeType:"Flat",

amount:5,

maximumFee:20,

minimumOrder:0

},

handlingFee:{

enabled:true,

feeType:"Flat",

amount:8,

minimumOrder:0

},

packagingFee:{

enabled:true,

amount:10

},

rainFee:{

enabled:false,

amount:20

},

surgeFee:{

enabled:false,

amount:25

},

gst:{

enabled:true,

percentage:18

},

vendorSettings:{

commission:12,

settlementDays:7

},

codCharge:20,

codMinimumOrder:0,

cancellationCharge:{

enabled:false,

amount:20

},

returnCharge:{

enabled:false,

amount:30

},

refundProcessingFee:{

enabled:false,

amount:10

},

walletSettings:{

enabled:true,

minimumRecharge:100,

maximumRecharge:10000

},

invoicePrefix:"NG",

invoiceFooter:"Thank you for shopping with NexttGrains.",

active:true

});

/* ==========================================================
        EDIT DATA
========================================================== */

useEffect(()=>{

if(finance){

setFormData(finance);

}

},[finance]);

/* ==========================================================
        INPUT CHANGE
========================================================== */

const handleChange=(e)=>{

const{

name,

value,

type,

checked

}=e.target;

setFormData((prev)=>({

...prev,

[name]:

type==="checkbox"

?

checked

:

value

}));

};
/* ==========================================================
        NESTED INPUT CHANGE
========================================================== */

const handleNestedChange=(section,field,value)=>{

setFormData((prev)=>({

...prev,

[section]:{

...prev[section],

[field]:value

}

}));

};

/* ==========================================================
        DELIVERY RULE CHANGE
========================================================== */

const handleDeliveryRuleChange=(

index,

field,

value

)=>{

const updatedRules=[

...formData.deliveryRules

];

updatedRules[index]={

...updatedRules[index],

[field]:

field==="freeDelivery"

?

value

:

Number(value)

};

setFormData((prev)=>({

...prev,

deliveryRules:updatedRules

}));

};

/* ==========================================================
        ADD DELIVERY RULE
========================================================== */

const addDeliveryRule=()=>{

setFormData((prev)=>({

...prev,

deliveryRules:[

...prev.deliveryRules,

{

minAmount:0,

maxAmount:0,

deliveryCharge:0,

freeDelivery:false

}

]

}));

};

/* ==========================================================
        DELETE DELIVERY RULE
========================================================== */

const removeDeliveryRule=(index)=>{

const updated=[

...formData.deliveryRules

];

updated.splice(index,1);

setFormData((prev)=>({

...prev,

deliveryRules:updated

}));

};

/* ==========================================================
        SAVE SETTINGS
========================================================== */

const saveFinance=async(e)=>{

e.preventDefault();

try{

setLoading(true);

if(finance){

await axios.put(

`${API}/update`,

formData

);

}

else{

await axios.post(

`${API}/create`,

formData

);

}

refreshFinance();

onClose();

}

catch(error){

console.log(error);

alert(

error.response?.data?.message ||

"Unable to save finance settings."

);

}

finally{

setLoading(false);

}

};

return(

<div className="finance-popup-overlay">

<div className="finance-popup">
    {/* ==========================================================
        HEADER
========================================================== */}

<div className="finance-popup-header">

<h2>

<FaWallet/>

Finance Settings

</h2>

<button

type="button"

className="finance-popup-close"

onClick={onClose}

>

<FaTimes/>

</button>

</div>

<form

className="finance-popup-form"

onSubmit={saveFinance}

>

{/* ==========================================================
        DELIVERY RULES
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaTruck/>

<h3>

Delivery Charge Rules

</h3>

</div>

<p>

Configure delivery fee based on order amount.

</p>

{

formData.deliveryRules.map((rule,index)=>(

<div

className="finance-delivery-rule"

key={index}

>

<div className="finance-rule-grid">

<div className="finance-input-group">

<label>

Minimum Order

</label>

<input

type="number"

value={rule.minAmount}

onChange={(e)=>

handleDeliveryRuleChange(

index,

"minAmount",

e.target.value

)

}

/>

</div>

<div className="finance-input-group">

<label>

Maximum Order

</label>

<input

type="number"

value={rule.maxAmount}

onChange={(e)=>

handleDeliveryRuleChange(

index,

"maxAmount",

e.target.value

)

}

/>

</div>

<div className="finance-input-group">

<label>

Delivery Charge

</label>

<input

type="number"

value={rule.deliveryCharge}

onChange={(e)=>

handleDeliveryRuleChange(

index,

"deliveryCharge",

e.target.value

)

}

/>

</div>

<div className="finance-checkbox-group">

<label>

Free Delivery

</label>

<input

type="checkbox"

checked={rule.freeDelivery}

onChange={(e)=>

handleDeliveryRuleChange(

index,

"freeDelivery",

e.target.checked

)

}

/>

</div>

</div>

{

formData.deliveryRules.length>1 &&

(

<button

type="button"

className="finance-delete-rule"

onClick={()=>removeDeliveryRule(index)}

>

<FaTrash/>

Remove Rule

</button>

)

}

</div>

))

}

<button

type="button"

className="finance-add-rule"

onClick={addDeliveryRule}

>

<FaPlus/>

Add Delivery Rule

</button>

</div>

{/* ==========================================================
        PLATFORM FEE
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaMoneyBillWave/>

<h3>

Platform Fee

</h3>

</div>

<div className="finance-four-grid">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.platformFee.enabled}

onChange={(e)=>

handleNestedChange(

"platformFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Fee Type

</label>

<select

value={formData.platformFee.feeType}

onChange={(e)=>

handleNestedChange(

"platformFee",

"feeType",

e.target.value

)

}

>

<option>

Flat

</option>

<option>

Percentage

</option>

</select>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.platformFee.amount}

onChange={(e)=>

handleNestedChange(

"platformFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

<div className="finance-input-group">

<label>

Maximum Fee

</label>

<input

type="number"

value={formData.platformFee.maximumFee}

onChange={(e)=>

handleNestedChange(

"platformFee",

"maximumFee",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>
{/* ==========================================================
        HANDLING FEE
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaWallet/>

<h3>

Handling Fee

</h3>

</div>

<div className="finance-four-grid">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.handlingFee.enabled}

onChange={(e)=>

handleNestedChange(

"handlingFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Fee Type

</label>

<select

value={formData.handlingFee.feeType}

onChange={(e)=>

handleNestedChange(

"handlingFee",

"feeType",

e.target.value

)

}

>

<option>

Flat

</option>

<option>

Percentage

</option>

</select>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.handlingFee.amount}

onChange={(e)=>

handleNestedChange(

"handlingFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

<div className="finance-input-group">

<label>

Minimum Order

</label>

<input

type="number"

value={formData.handlingFee.minimumOrder}

onChange={(e)=>

handleNestedChange(

"handlingFee",

"minimumOrder",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ==========================================================
        OTHER FEES
========================================================== */}

<div className="finance-two-grid">

{/* ================= PACKAGING ================= */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaBoxOpen/>

<h3>

Packaging Fee

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.packagingFee.enabled}

onChange={(e)=>

handleNestedChange(

"packagingFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.packagingFee.amount}

onChange={(e)=>

handleNestedChange(

"packagingFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ================= RAIN ================= */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaCloudRain/>

<h3>

Rain Fee

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.rainFee.enabled}

onChange={(e)=>

handleNestedChange(

"rainFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.rainFee.amount}

onChange={(e)=>

handleNestedChange(

"rainFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ================= SURGE ================= */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaBolt/>

<h3>

Surge Fee

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.surgeFee.enabled}

onChange={(e)=>

handleNestedChange(

"surgeFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.surgeFee.amount}

onChange={(e)=>

handleNestedChange(

"surgeFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ================= GST ================= */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaPercentage/>

<h3>

GST

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.gst.enabled}

onChange={(e)=>

handleNestedChange(

"gst",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

GST %

</label>

<input

type="number"

value={formData.gst.percentage}

onChange={(e)=>

handleNestedChange(

"gst",

"percentage",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

</div>
{/* ==========================================================
        VENDOR SETTINGS
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaStore/>

<h3>

Vendor Settings

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Commission (%)

</label>

<input

type="number"

value={formData.vendorSettings.commission}

onChange={(e)=>

handleNestedChange(

"vendorSettings",

"commission",

Number(e.target.value)

)

}

/>

</div>

<div className="finance-input-group">

<label>

Settlement Days

</label>

<input

type="number"

value={formData.vendorSettings.settlementDays}

onChange={(e)=>

handleNestedChange(

"vendorSettings",

"settlementDays",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ==========================================================
        COD SETTINGS
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaMoneyCheckAlt/>

<h3>

Cash On Delivery

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

COD Charge

</label>

<input

type="number"

name="codCharge"

value={formData.codCharge}

onChange={handleChange}

/>

</div>

<div className="finance-input-group">

<label>

Minimum Order

</label>

<input

type="number"

name="codMinimumOrder"

value={formData.codMinimumOrder}

onChange={handleChange}

/>

</div>

</div>

</div>

{/* ==========================================================
        RETURN & REFUND
========================================================== */}

<div className="finance-three-grid">

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaUndo/>

<h3>

Cancellation

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.cancellationCharge.enabled}

onChange={(e)=>

handleNestedChange(

"cancellationCharge",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.cancellationCharge.amount}

onChange={(e)=>

handleNestedChange(

"cancellationCharge",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaUndo/>

<h3>

Return Charge

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.returnCharge.enabled}

onChange={(e)=>

handleNestedChange(

"returnCharge",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.returnCharge.amount}

onChange={(e)=>

handleNestedChange(

"returnCharge",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaMoneyBillWave/>

<h3>

Refund Processing

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.refundProcessingFee.enabled}

onChange={(e)=>

handleNestedChange(

"refundProcessingFee",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Amount

</label>

<input

type="number"

value={formData.refundProcessingFee.amount}

onChange={(e)=>

handleNestedChange(

"refundProcessingFee",

"amount",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

</div>

{/* ==========================================================
        WALLET
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaWallet/>

<h3>

Wallet Settings

</h3>

</div>

<div className="finance-three-grid">

<div className="finance-input-group">

<label>

Enabled

</label>

<input

type="checkbox"

checked={formData.walletSettings.enabled}

onChange={(e)=>

handleNestedChange(

"walletSettings",

"enabled",

e.target.checked

)

}

/>

</div>

<div className="finance-input-group">

<label>

Minimum Recharge

</label>

<input

type="number"

value={formData.walletSettings.minimumRecharge}

onChange={(e)=>

handleNestedChange(

"walletSettings",

"minimumRecharge",

Number(e.target.value)

)

}

/>

</div>

<div className="finance-input-group">

<label>

Maximum Recharge

</label>

<input

type="number"

value={formData.walletSettings.maximumRecharge}

onChange={(e)=>

handleNestedChange(

"walletSettings",

"maximumRecharge",

Number(e.target.value)

)

}

/>

</div>

</div>

</div>

{/* ==========================================================
        INVOICE
========================================================== */}

<div className="finance-setting-card">

<div className="finance-setting-title">

<FaFileInvoiceDollar/>

<h3>

Invoice Settings

</h3>

</div>

<div className="finance-two-column">

<div className="finance-input-group">

<label>

Invoice Prefix

</label>

<input

type="text"

name="invoicePrefix"

value={formData.invoicePrefix}

onChange={handleChange}

/>

</div>

<div className="finance-input-group">

<label>

Invoice Footer

</label>

<input

type="text"

name="invoiceFooter"

value={formData.invoiceFooter}

onChange={handleChange}

/>

</div>

</div>

</div>

{/* ==========================================================
        FOOTER
========================================================== */}

<div className="finance-popup-footer">

<button

type="button"

className="finance-cancel-btn"

onClick={onClose}

>

<FaTimes/>

Cancel

</button>

<button

type="submit"

className="finance-save-btn"

disabled={loading}

>

<FaSave/>

{

loading

?

"Saving..."

:

"Save Settings"

}

</button>

</div>

</form>

</div>

</div>

);

}

export default SetCharges;