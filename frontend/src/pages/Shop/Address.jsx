import "./Address.css";
import axios from "axios";
import { createPaymentOrder, verifyPayment } from "../../services/paymentApi";
import { useCart } from "../../context/CartContext";
import { useAddress } from "../../context/AddressContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
MapContainer,
TileLayer,
Marker,
Circle,
useMapEvents,
useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
iconRetinaUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

iconUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

shadowUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import {
  IoClose,
  IoLocationOutline,
  IoAddCircleOutline,
  IoChevronForward,
  IoCreateOutline,
  IoTrashOutline,
  IoArrowBack,
} from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";

function Address({
  open = true,
  onClose = () => {},
  fullPage = false,
}) {
    const [ngAddressShowForm, setNgAddressShowForm] = useState(false);
const navigate=useNavigate();
const [editingAddress,setEditingAddress]=useState(null);
const [mapCenter, setMapCenter] = useState({
  lat: 21.1458,
  lng: 79.0882,
});

const [markerPosition, setMarkerPosition] = useState({
  lat: 21.1458,
  lng: 79.0882,
});
const getAddressFromLatLng = async (lat, lng) => {

try{

const res = await axios.get(

`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=9629e5a8f11d4166ab0173291ad79706`

);

const result = res.data.results[0];

if(!result) return;

const c = result.components;

setNgAddressFormData(prev=>({

...prev,

latitude:lat,

longitude:lng,

formattedAddress:result.formatted,

area:

c.suburb ||

c.neighbourhood ||

c.city_district ||

"",

city:

c.city ||

c.town ||

c.village ||

"",

state:

c.state ||

"",

pincode:

c.postcode ||

""

}));

}

catch(err){

console.log(err);

}

};

const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    loadAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = useAddress();
const { cart } = useCart();
const [ngAddressFormData, setNgAddressFormData] = useState({

    fullName: "",

    mobile: "",

    houseNo: "",

    floor: "",

    landmark: "",

    area: "",

    city: "",

    state: "",

    pincode: "",

    latitude: "",

    longitude: "",

    formattedAddress: "",

    addressType: "Home",

});

const handleCurrentLocation = () => {

navigator.geolocation.getCurrentPosition(
    (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(position.coords.accuracy);

        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });

        getAddressFromLatLng(lat, lng);

    },
    (err) => {
        console.log(err);
    },
    {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
    }
);
};

function ChangeMapCenter({ center }) {

const map = useMap();

useEffect(() => {

map.setView(center,18,{

animate:true

});

},[center]);

return null;

}

function LocationMarker({

markerPosition,

setMarkerPosition,

setMapCenter,

getAddressFromLatLng

}){

useMapEvents({

dragend(){},

click(e){

setMarkerPosition(e.latlng);

setMapCenter(e.latlng);

getAddressFromLatLng(

e.latlng.lat,

e.latlng.lng

);

}

});

return (

<Marker

draggable={true}

position={markerPosition}

eventHandlers={{

dragend:(e)=>{

const latlng=e.target.getLatLng();

setMarkerPosition(latlng);

setMapCenter(latlng);

getAddressFromLatLng(

latlng.lat,

latlng.lng

);

}
}}

/>

);

}
//edit address
const handleEdit = (address) => {

setEditingAddress(address);

setNgAddressFormData({

fullName:address.fullName,

mobile:address.mobile,

houseNo:address.houseNo,

floor:address.floor,

landmark:address.landmark,

area:address.area,

city:address.city,

state:address.state,

pincode:address.pincode,

latitude:address.latitude,

longitude:address.longitude,

formattedAddress:address.formattedAddress,

addressType:address.addressType

});

setMarkerPosition({

lat:address.latitude,

lng:address.longitude

});

setMapCenter({

lat:address.latitude,

lng:address.longitude

});

setNgAddressShowForm(true);

};

// delete address
const handleDelete = async(id)=>{

const ok=window.confirm("Delete this address?");

if(!ok) return;

await deleteAddress(id);

await loadAddresses();

};

// save address
const handleSaveAddress = async () => {
 // Validation
    if (
        !ngAddressFormData.fullName ||
        !ngAddressFormData.mobile ||
        !ngAddressFormData.houseNo ||
        !ngAddressFormData.area ||
        !ngAddressFormData.city ||
        !ngAddressFormData.state ||
        !ngAddressFormData.pincode
    ) {
        alert("Please fill all required fields");
        return;
    }
     if(
        !ngAddressFormData.latitude ||
        !ngAddressFormData.longitude
    ){
        alert("Please use Current Location");
        return;
    }
    // const response = await addAddress(ngAddressFormData);
    let response;

if(editingAddress){

response=await updateAddress(

editingAddress._id,

ngAddressFormData

);

setEditingAddress(null);

}else{

response=await addAddress(

ngAddressFormData

);

}
    await loadAddresses();
    if(response?.success){

        setNgAddressShowForm(false);

        setNgAddressFormData({
            fullName:"",
            mobile:"",
            houseNo:"",
            floor:"",
            landmark:"",
            area:"",
            city:"",
            state:"",
            pincode:"",
            latitude:"",
            longitude:"",
            formattedAddress:"",
            addressType:"Home"
        });
}

};

// const handleContinue = () => {

//     if (!selectedAddress) {

//         alert("Please select an address");

//         return;

//     }

//     localStorage.setItem(

//         "selectedAddress",

//         JSON.stringify(selectedAddress)

//     );

//     onClose();

// };

const handleContinue = async () => {

    if(!selectedAddress){

        alert("Please Select Address");

        return;

    }

    // Cart Context se ye values aayengi

const subtotal =
cart.cart.items.reduce(

(sum,item)=>

sum + item.product.price * item.quantity,

0

);

const deliveryCharge =
subtotal>499 ? 0 : 40;

const platformFee=20;

const handlingCharge=10;

const grandTotal=

subtotal+

deliveryCharge+

platformFee+

handlingCharge;

const paymentData={

addressId:selectedAddress._id,

items: cart.cart.items.map((item)=>{

    console.log(item.product);

    return {

        product:item.product._id,

        // vendor:item.product.vendor,
         vendor: item.product.vendorId,
        name:item.product.name,

        image:item.product.images?.[0] || "",

        price:item.product.price,

        quantity:item.quantity,

        total:item.product.price * item.quantity

    }

}),

subtotal,

deliveryCharge,

platformFee,

handlingCharge,

discount:0,

grandTotal

};
    const data=await createPaymentOrder(paymentData);

    openRazorpay(data);

};
const openRazorpay=(data)=>{

const options={

key:"rzp_test_T99Efd6smK9xBC",

amount:data.razorpayOrder.amount,

currency:"INR",

name:"NexttGrains",

description:"Order Payment",

image:"/logo.png",

order_id:data.razorpayOrder.id,

handler: async function (response) {

    const verify = await verifyPayment({

        razorpay_order_id: response.razorpay_order_id,

        razorpay_payment_id: response.razorpay_payment_id,

        razorpay_signature: response.razorpay_signature,

    });

    onClose();     // Close Drawer

    if (verify.success) {

        navigate("/payment/success");

    }

    else{

        navigate("/payment/failed");

    }
},

theme:{

color:"#18B75A"

}

};

const razor=new window.Razorpay(options);

razor.open();

}

useEffect(() => {

    if(open){

        (async()=>{

            await loadAddresses();

        })();

    }

}, [open]);
if (!fullPage && !open) return null;
    return (

        <>

            {/* Overlay */}
{
!fullPage && (
<div
className="ngAddressOverlay"
onClick={onClose}
/>
)
}

            {/* Drawer */}

<aside
className={
fullPage
?
"ngAddressDrawer ngAddressFullPage"
:
"ngAddressDrawer"
}
>
                {/* Header */}

                <div className="ngAddressHeader">

                    <h2 className="ngAddressHeading">

                        Select Delivery Address

                    </h2>

               {
  fullPage ? (
    <button
      className="ngAddressBackBtn"
      onClick={() => navigate(-1)}
    >
      <IoArrowBack />
      Back
    </button>
  ) : (
    <button
      className="ngAddressCloseBtn"
      onClick={onClose}
    >
      <IoClose />
    </button>
  )
}

                </div>

                {/* Scroll Area */}

                <div className="ngAddressScrollArea">

                    {/* Current Location */}

                   <div

className="ngAddressCurrentLocationCard"

onClick={handleCurrentLocation}

>
                        <div className="ngAddressCurrentLeft">

                            <div className="ngAddressLocationIconBox">

                                <MdLocationOn />

                            </div>

                            <div>

                                <h4>

                                    Use Current Location

                                </h4>

                                <p>

                                    Find your exact delivery location

                                </p>

                            </div>

                        </div>

                        <button
                            className="ngAddressArrowBtn"
                        >

                            <IoChevronForward />

                        </button>

                    </div>

{/* map */}
<div className="ngAddressMapWrapper">

<MapContainer

center={mapCenter}

zoom={21}
scrollWheelZoom={true}

doubleClickZoom={true}

dragging={true}

zoomControl={false}
style={{

height:"260px",

width:"100%"

}}

>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<ChangeMapCenter
center={mapCenter}
/>

<Circle
center={markerPosition}
radius={15}
/>

<LocationMarker

markerPosition={markerPosition}

setMarkerPosition={setMarkerPosition}

setMapCenter={setMapCenter}

getAddressFromLatLng={getAddressFromLatLng}

/>

</MapContainer>

</div>
                    {/* Divider */}

                    <div className="ngAddressSectionDivider"/>

                    {/* Saved Address */}

                    <div className="ngAddressSavedSection">

                        <h3 className="ngAddressSectionTitle">

                            Saved Addresses

                        </h3>

                        {/* Empty State */}

{
(addresses || []).length === 0 ? (

<div className="ngAddressEmptyCard">

    <IoLocationOutline className="ngAddressEmptyIcon"/>

    <h4>No Saved Address</h4>

    <p>Add your first delivery address.</p>

    <button
        className="ngAddressEmptyAddBtn"
        onClick={() => setNgAddressShowForm(true)}
    >
        Add Address
    </button>

</div>

) : (

(addresses || []).map(address => (
<div
key={address._id}
className={
selectedAddress?._id===address._id
?
"ngAddressSavedCard ngAddressSelected"
:
"ngAddressSavedCard"
}
onClick={()=>setSelectedAddress(address)}
>

<div className="ngAddressSavedLeft">

<div className="ngAddressSavedIcon">

<MdLocationOn/>

</div>

<div className="ngAddressSavedContent">

<h4>

{address.addressType}

</h4>

<p>

{address.houseNo},

{address.area},

{address.city}

</p>

<p>

{address.mobile}

</p>

</div>

</div>

<div className="ngAddressActionButtons">

<button

className="ngAddressEditBtn"

onClick={(e)=>{

e.stopPropagation();

handleEdit(address);

}}

>

<IoCreateOutline/>

</button>

<button

className="ngAddressDeleteBtn"

onClick={(e)=>{

e.stopPropagation();

handleDelete(address._id);

}}

>

<IoTrashOutline/>

</button>

</div>

</div>

))
)}

                    </div>
{

ngAddressShowForm && (

<div className="ngAddressFormContainer">

<h3>

{

editingAddress

?

"Edit Address"

:

"Add Delivery Address"

}

</h3>

<div className="ngAddressFormGrid">

<div className="ngAddressInputGroup">
<label>Full Name</label>

<input
className="ngAddressInput"
placeholder="Enter Full Name"
value={ngAddressFormData.fullName}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
fullName:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup">
<label>Mobile Number</label>

<input
className="ngAddressInput"
placeholder="9876543210"
value={ngAddressFormData.mobile}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
mobile:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup">

<label>House / Flat No.</label>

<input
className="ngAddressInput"
placeholder="Flat / House No."
value={ngAddressFormData.houseNo}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
houseNo:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup">

<label>Floor</label>

<input
className="ngAddressInput"
placeholder="Optional"
value={ngAddressFormData.floor}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
floor:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup ngAddressFull">

<label>Landmark</label>

<input
className="ngAddressInput"
placeholder="Near Temple"
value={ngAddressFormData.landmark}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
landmark:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup ngAddressFull">

<label>Area</label>

<input
className="ngAddressInput"
placeholder="Area"
value={ngAddressFormData.area}
// readOnly
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
area:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup">

<label>City</label>

<input
className="ngAddressInput"
placeholder="City"
value={ngAddressFormData.city}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
city:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup">

<label>State</label>

<input
className="ngAddressInput"
placeholder="State"
value={ngAddressFormData.state}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
state:e.target.value
})
}
/>

</div>


<div className="ngAddressInputGroup ngAddressFull">

<label>Pincode</label>

<input
className="ngAddressInput"
placeholder="440024"
value={ngAddressFormData.pincode}
onChange={(e)=>
setNgAddressFormData({
...ngAddressFormData,
pincode:e.target.value
})
}
/>

</div>

</div>
{/* bnenenen */}
<div className="ngAddressTypeRow">

<button
type="button"
className={
ngAddressFormData.addressType==="Home"
?
"ngAddressTypeActive"
:
"ngAddressTypeBtn"
}
onClick={()=>
setNgAddressFormData({
...ngAddressFormData,
addressType:"Home"
})
}
>
Home
</button>

<button
type="button"
className={
ngAddressFormData.addressType==="Work"
?
"ngAddressTypeActive"
:
"ngAddressTypeBtn"
}
onClick={()=>
setNgAddressFormData({
...ngAddressFormData,
addressType:"Work"
})
}
>
Work
</button>

<button
type="button"
className={
ngAddressFormData.addressType==="Other"
?
"ngAddressTypeActive"
:
"ngAddressTypeBtn"
}
onClick={()=>
setNgAddressFormData({
...ngAddressFormData,
addressType:"Other"
})
}
>
Other
</button>

</div>
<div className="ngAddressButtonRow">

<button
className="ngAddressCancelBtn"
onClick={() => {

    setNgAddressShowForm(false);

    setNgAddressFormData({

        fullName:"",
        mobile:"",
        houseNo:"",
        floor:"",
        landmark:"",
        area:"",
        city:"",
        state:"",
        pincode:"",
        latitude:"",
        longitude:"",
        formattedAddress:"",
        addressType:"Home"

    });

}}
>
Cancel
</button>

<button
type="button"
className="ngAddressSaveBtn"
onClick={handleSaveAddress}
>
{

editingAddress

?

"Update Address"

:

"Save Address"

}
</button>

</div>
</div>
)
}
                    {/* Add Address */}

{
!ngAddressShowForm && (

<div
className="ngAddressAddCard"
onClick={()=>setNgAddressShowForm(true)}
>

                        <div
                            className="ngAddressAddLeft"
                        >

                            <IoAddCircleOutline
                                className="ngAddressAddIcon"
                            />

                            <span>

                                Add New Address

                            </span>

                        </div>

                        <IoChevronForward
                            className="ngAddressAddArrow"
                        />

                    </div>
)}
                </div>

                {/* Footer */}

  {
!fullPage && (

<div className="ngAddressFooter">

<button
className="ngAddressContinueBtn"
disabled={!selectedAddress}
onClick={handleContinue}
>
Proceed to Pay
</button>

</div>

)
}

            </aside>

        </>

    );

}

export default Address;