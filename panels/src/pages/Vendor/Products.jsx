import "./Products.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FiPackage,
    FiTrendingUp,
    FiAlertTriangle,
    FiXCircle,
    FiMoreVertical,
    FiPlus,
    FiDownload
} from "react-icons/fi";

export default function Products() {
console.log("Products Component Rendered");

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
const [category,setCategory]=useState("All");

const [status,setStatus]=useState("All");

const [page,setPage]=useState(1);

const perPage=8;
    const [search, setSearch] = useState("");

const vendorData = localStorage.getItem("vendor");

const vendor = vendorData
  ? JSON.parse(vendorData)
  : null;

    useEffect(() => {

        getProducts();

    }, []);

    const getProducts = async () => {

    if (!vendor) {

        console.log("Vendor not logged in");

        return;
    }

    try {
console.log(vendor);
        const res = await axios.get(
            `http://localhost:5000/api/products/vendor/${vendor._id}`
        );
console.log(res.data);

        setProducts(res.data.products);

    }

    catch (err) {

        console.log(err);

    }

};

const changeProductStatus = async(id,status)=>{

try{

await axios.patch(

`http://localhost:5000/api/products/status/${id}`,

{

status

}

);

getProducts();

}

catch(err){

console.log(err);

}

}

    const deleteProduct = async (id) => {

        if (!window.confirm("Delete Product ?"))

            return;

        await axios.delete(

            `http://localhost:5000/api/products/delete/${id}`

        );

        getProducts();

    };

    const filtered = products.filter(item =>

        item.name.toLowerCase().includes(search.toLowerCase())

    );
    const filteredProducts=products.filter(item=>{

const matchSearch=item.name
.toLowerCase()
.includes(search.toLowerCase());

const matchCategory=

category==="All"

||

item.category===category;

const matchStatus=

status==="All"

||

item.status===status;

return matchSearch && matchCategory && matchStatus;

});
const lastIndex=page*perPage;

const firstIndex=lastIndex-perPage;

const current=

filteredProducts.slice(

firstIndex,

lastIndex

);

const getDiscount = (mrp, price) => {

if(!mrp || !price) return 0;

return Math.round(

((mrp - price) / mrp) * 100

);

};

    return (
        

        <div className="ngProductsPage">

            <div className="ngProductTop">

                <div>

                    <h1>

                        My Products

                    </h1>

                    <p>

                        Catalog you sell on NextTGrains.

                    </p>

                </div>

                <div className="ngBtns">

                    <button>

                       <>
<FiDownload/>
Export
</>

                    </button>

                    <button

                        className="greenBtn"

                        onClick={() =>

                            navigate(

                                "/vendor/products/add"

                            )

                        }

                    >

                        <>
<FiPlus/>
Add Product
</>

                    </button>

                </div>

            </div>

<div className="ngCards">

    <div className="ngCard">
        <div className="ngCardLeft">
            <h5>SKUS</h5>
            <h2>{products.length}</h2>
        </div>

        <div className="ngCardIcon">
            <FiPackage/>
        </div>
    </div>

    <div className="ngCard">
        <div className="ngCardLeft">
            <h5>ACTIVE</h5>
            <h2>
                {
                    products.filter(
                        p=>p.status==="Active"
                    ).length
                }
            </h2>
        </div>

        <div className="ngCardIcon">
            <FiTrendingUp/>
        </div>
    </div>

    <div className="ngCard">
        <div className="ngCardLeft">
            <h5>LOW STOCK</h5>
            <h2>
                {
                    products.filter(
                        p=>p.stock<10
                    ).length
                }
            </h2>
        </div>

        <div className="ngCardIcon ngWarning">
            <FiAlertTriangle/>
        </div>
    </div>

    <div className="ngCard">
        <div className="ngCardLeft">
            <h5>OUT STOCK</h5>
            <h2>
                {
                    products.filter(
                        p=>p.stock===0
                    ).length
                }
            </h2>
        </div>

        <div className="ngCardIcon ngDanger">
            <FiXCircle/>
        </div>
    </div>

            </div>

<input
className="ngVendorProductSearch"
placeholder="Search your products..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>



<div className="ngVendorProductsGrid">
    {
current.map(product=>(
<div
className="ngVendorMiniCard"
key={product._id}
>

<div className="ngVendorMiniTop">

<span className="ngVendorMiniCategory">

{product.category}

</span>

<div className="ngVendorMiniRight">

<img
src={product.images[0]}
className="ngVendorMiniImage"
/>

<div className="ngVendorMiniMenu">

<FiMoreVertical/>

<div className="ngVendorMiniDropdown">
<p
onClick={()=>
changeProductStatus(
product._id,
product.status==="Active"
?
"Inactive"
:
"Active"
)
}
>

{
product.status==="Active"
?
"Inactive"
:
"Active"
}

</p>
<p
onClick={()=>
navigate(
`/vendor/products/edit/${product._id}`
)
}
>
Edit
</p>

<p
onClick={()=>deleteProduct(product._id)}
>

Delete

</p>

</div>

</div>

</div>

</div>
{/* <div className="ngVendorTitleRow">

<h3 className="ngVendorMiniTitle">

{product.name}

</h3>
<span className="ngVendorQtyTag">

{product.quantity} {product.unit}

</span>
</div> */}
<h3 className="ngVendorMiniTitle">

{product.name} {product.quantity}{product.unit}

</h3>
<p className="ngVendorMiniDesc">

{product.shortDescription}

</p>

<hr/>

<div className="ngVendorMiniBottom">

<div>
    
<div className="ngVendorPriceRow">

<h2 className="ngVendorPrice">

₹{product.price}

</h2>

<span className="ngVendorMrp">

₹{product.mrp}

</span>

<span className="ngVendorDiscount">

{getDiscount(
product.mrp,
product.price
)}% OFF

</span>

</div>

<div
className={
product.stock<=3
?
"ngVendorLowStockBadge"
:
"ngVendorStockBadge"
}
>

Stock : {product.stock}

</div>

</div>

<div className="ngVendorDateBox">

<p>

MFG: 

{product.packagingDate?.slice(0,10)}

</p>

<p>

EXP:  

{product.expiryDate?.slice(0,10)}

</p>

</div>
</div>

</div>

))

}

</div>

        </div>

    );

}