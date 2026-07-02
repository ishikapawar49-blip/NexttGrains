import "./Address.css";
import { useAddress } from "../../context/AddressContext";
import { useState, useEffect } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoAddCircleOutline,
  IoChevronForward,
} from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";

function Address({ open, onClose,}) {
const [ngAddressShowForm, setNgAddressShowForm] = useState(false);
const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    loadAddresses,
    addAddress,
} = useAddress();
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

async(position)=>{

const { latitude, longitude } = position.coords;

setNgAddressFormData({

...ngAddressFormData,

latitude,

longitude,

});

},

(error)=>{

alert("Location permission denied");

}

);

};

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
    const response = await addAddress(ngAddressFormData);
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

useEffect(() => {

    if(open){

        (async()=>{

            await loadAddresses();

        })();

    }

}, [open]);
    if (!open) return null;

    return (

        <>

            {/* Overlay */}

            <div
                className="ngAddressOverlay"
                onClick={onClose}
            />

            {/* Drawer */}

            <aside className="ngAddressDrawer">

                {/* Header */}

                <div className="ngAddressHeader">

                    <h2 className="ngAddressHeading">

                        Select Delivery Address

                    </h2>

                    <button
                        className="ngAddressCloseBtn"
                        onClick={onClose}
                    >

                        <IoClose />

                    </button>

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

</div>

))
)}

                    </div>
{

ngAddressShowForm && (

<div className="ngAddressFormContainer">

<h3 className="ngAddressFormTitle">
Add Delivery Address
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
Save Address
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

                <div className="ngAddressFooter">

<button
    className="ngAddressContinueBtn"
    disabled={!selectedAddress}
    onClick={() => {
        console.log(selectedAddress);
    }}
>
    Continue
</button>

                </div>

            </aside>

        </>

    );

}

export default Address;