import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./ProductManagement.css";

import {
  FiSearch,
  FiPlus,
  FiGrid,
  FiList,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiDownload
} from "react-icons/fi";

import {
  FaLeaf,
  FaBoxOpen,
  FaRupeeSign
} from "react-icons/fa";

import {
  MdInventory2
} from "react-icons/md";

const API = "http://localhost:5000/api/products/admin";

const ProductManagement = () => {

  // ==============================
  // STATES
  // ==============================

  const [products, setProducts] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("table");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [stockFilter, setStockFilter] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);

  const [stats, setStats] = useState({
      totalProducts:0,
      activeProducts:0,
      lowStock:0,
      totalValue:0,
      totalSold:0
  });

  const itemsPerPage = 10;

  // ==============================
  // FETCH PRODUCTS
  // ==============================

  const fetchProducts = async()=>{

      try{

          setLoading(true);

const res = await axios.get(`${API}/all`);

          const data =
              res.data.products ||
              res.data.data ||
              res.data;

          setProducts(data);

          setFilteredProducts(data);

      }

      catch(err){

          console.log(err);

      }

      finally{

          setLoading(false);

      }

  }

  useEffect(()=>{

      fetchProducts();

  },[]);

  // ==============================
  // DASHBOARD STATS
  // ==============================

  useEffect(()=>{

      let active = 0;
      let stock = 0;
      let totalValue = 0;
      let totalSold = 0;
     products.forEach((item)=>{

    if(item.status==="Active")
        active++;

    if(item.stock <= item.minStock)
        stock++;

    totalValue += item.price * item.stock;

    totalSold += item.sold || 0;

});
      setStats({

          totalProducts:products.length,

          activeProducts:active,

          lowStock:stock,

          totalValue,
           totalSold

      });

  },[products]);

  // ==============================
  // SEARCH
  // ==============================

  useEffect(()=>{

      let data=[...products];

      // SEARCH

      if(search){

          data=data.filter((item)=>

              item.name.toLowerCase().includes(search.toLowerCase())

              ||

              item.brand.toLowerCase().includes(search.toLowerCase())

              ||

              item.category.toLowerCase().includes(search.toLowerCase())

              ||

              item.productId.toLowerCase().includes(search.toLowerCase())

          );

      }

      // CATEGORY

      if(categoryFilter!=="All"){

          data=data.filter(

              item=>item.category===categoryFilter

          );

      }

      // STATUS

      if(statusFilter!=="All"){

          data=data.filter(

              item=>item.status===statusFilter

          );

      }

      // STOCK

      if(stockFilter==="Low"){

          data=data.filter(

              item=>item.stock<=item.minStock

          );

      }

      if(stockFilter==="Out"){

          data=data.filter(

              item=>item.stock===0

          );

      }

      // SORT

      switch(sortBy){

          case "Price Low":

              data.sort((a,b)=>a.price-b.price);

          break;

          case "Price High":

              data.sort((a,b)=>b.price-a.price);

          break;

          case "Oldest":

              data.sort(

                  (a,b)=>new Date(a.createdAt)-new Date(b.createdAt)

              );

          break;

          default:

              data.sort(

                  (a,b)=>new Date(b.createdAt)-new Date(a.createdAt)

              );

      }

      setFilteredProducts(data);

      setCurrentPage(1);

  },[
      search,
      categoryFilter,
      statusFilter,
      stockFilter,
      sortBy,
      products
  ]);

  // ==============================
  // PAGINATION
  // ==============================

  const totalPages=Math.ceil(

      filteredProducts.length/itemsPerPage

  );

  const currentProducts=useMemo(()=>{

      const start=(currentPage-1)*itemsPerPage;

      return filteredProducts.slice(

          start,

          start+itemsPerPage

      );

  },[filteredProducts,currentPage]);
  // ==============================
  // UNIQUE CATEGORIES
  // ==============================

  const categories = useMemo(() => {

    const list = products.map(item => item.category);

    return ["All", ...new Set(list)];

  }, [products]);



  // ==============================
  // REFRESH PRODUCTS
  // ==============================

  const handleRefresh = () => {

    fetchProducts();

  };



  // ==============================
  // GRID / TABLE VIEW
  // ==============================

  const handleGridView = () => {

    setViewMode("grid");

  };

  const handleTableView = () => {

    setViewMode("table");

  };



  // ==============================
  // PAGINATION
  // ==============================

  const nextPage = () => {

    if (currentPage < totalPages) {

      setCurrentPage(prev => prev + 1);

    }

  };



  const previousPage = () => {

    if (currentPage > 1) {

      setCurrentPage(prev => prev - 1);

    }

  };



  const goToPage = (page) => {

    setCurrentPage(page);

  };



  // ==============================
  // DELETE PRODUCT
  // ==============================

  const openDeleteModal = (product) => {

    setSelectedProduct(product);

    setDeleteModal(true);

  };



  const closeDeleteModal = () => {

    setDeleteModal(false);

    setSelectedProduct(null);

  };



  const deleteProduct = async () => {

    try {

      if (!selectedProduct) return;

     await axios.delete(
`http://localhost:5000/api/products/delete/${selectedProduct._id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

      fetchProducts();

      closeDeleteModal();

    }

    catch (err) {

      console.log(err);

    }

  };



  // ==============================
  // PRODUCT STATUS
  // ==============================

  const changeStatus = async (product) => {

    try {

      let newStatus =

        product.status === "Active"

          ? "Inactive"

          : "Active";



      await axios.put(

        `${API}/${product._id}`,

        {

          status: newStatus

        }

      );



      fetchProducts();

    }

    catch (err) {

      console.log(err);

    }

  };


  // ==============================
  // STOCK BADGE
  // ==============================

  const getStockColor = (stock, minStock) => {

    if (stock === 0) {

      return "stock-out";

    }

    if (stock <= minStock) {

      return "stock-low";

    }

    return "stock-good";

  };



  // ==============================
  // STATUS BADGE
  // ==============================

  const getStatusColor = (status) => {

    switch (status) {

      case "Active":

        return "status-active";

      case "Inactive":

        return "status-inactive";

      case "Out Of Stock":

        return "status-out";

      default:

        return "";

    }

  };



  // ==============================
  // PRICE FORMAT
  // ==============================

  const formatPrice = (price) => {

    return Number(price).toLocaleString("en-IN", {

      style: "currency",

      currency: "INR"

    });

  };



  // ==============================
  // DATE FORMAT
  // ==============================

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString("en-IN", {

      day: "2-digit",

      month: "short",

      year: "numeric"

    });

  };



  // ==============================
  // EXPORT CSV
  // ==============================

  const exportCSV = () => {

    const rows = [

      [

        "Product ID",

        "Name",

        "Category",

        "Brand",

        "Price",

        "Stock",

        "Status"

      ]

    ];



    filteredProducts.forEach(item => {

      rows.push([

        item.productId,

        item.name,

        item.category,

        item.brand,

        item.price,

        item.stock,

        item.status

      ]);

    });



    const csv = rows

      .map(r => r.join(","))

      .join("\n");



    const blob = new Blob(

      [csv],

      {

        type: "text/csv"

      }

    );



    const url = window.URL.createObjectURL(blob);



    const a = document.createElement("a");



    a.href = url;

    a.download = "products.csv";



    a.click();



    window.URL.revokeObjectURL(url);

  };

  // pdf
  const exportPDF = async () => {

    try{

        const response = await axios.get(

            "http://localhost:5000/api/products/admin/export/pdf",

            {
                responseType:"blob"
            }

        );

        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = url;

        link.download = "Products.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    }

    catch(err){

        console.log(err);

    }

};

  // ==============================
  // JSX
  // ==============================

  return (

    <div className="pm-container">

      {/* ===========================
          HEADER
      ============================ */}

      <div className="pm-header">

        <div>

          <h2>Product Management</h2>

          <p>
            Manage all products, inventory and pricing.
          </p>

        </div>

        <div className="pm-header-actions">

          <button
            className="pm-refresh-btn"
            onClick={handleRefresh}
          >
            <FiRefreshCw />
            Refresh
          </button>

         <div className="pm-export-dropdown">

    <button
        className="pm-export-btn"
        onClick={() => setShowExportMenu(!showExportMenu)}
    >
        <FiDownload />
        Export
    </button>

    {showExportMenu && (

        <div className="pm-export-menu">

            <button
                onClick={()=>{
                    exportCSV();
                    setShowExportMenu(false);
                }}
            >
                Export CSV
            </button>

            <button
                onClick={()=>{
                    exportPDF();
                    setShowExportMenu(false);
                }}
            >
                Export PDF
            </button>

        </div>

    )}

</div>

          {/* <button
            className="pm-add-btn"
          >
            <FiPlus />
            Add Product
          </button> */}

        </div>

      </div>



      {/* ===========================
            DASHBOARD CARDS
      ============================ */}

      <div className="pm-stats">

        <div className="pm-card">

          <div className="pm-card-icon green">

            <FaLeaf />

          </div>

          <div>

            <span>Total Products</span>

            <h3>

              {stats.totalProducts}

            </h3>

          </div>

        </div>



        <div className="pm-card">

          <div className="pm-card-icon blue">

            <MdInventory2 />

          </div>

          <div>

            <span>Active Products</span>

            <h3>

              {stats.activeProducts}

            </h3>

          </div>

        </div>



        <div className="pm-card">

          <div className="pm-card-icon orange">

            <FaBoxOpen />

          </div>

          <div>

            <span>Low Stock</span>

            <h3>

              {stats.lowStock}

            </h3>

          </div>

        </div>



        <div className="pm-card">

          <div className="pm-card-icon purple">

            <FaRupeeSign />

          </div>

          <div>

            <span>Total Inventory Value</span>

            <h3>

              {formatPrice(stats.totalValue)}

            </h3>

          </div>

        </div>

      </div>

      {/* ===========================
              TOOLBAR
      ============================ */}

      <div className="pm-toolbar">

        {/* Search */}

        <div className="pm-search">

          <FiSearch />

          <input

            type="text"

            placeholder="Search products..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />

        </div>



        {/* Filters */}

        <div className="pm-filters">

          <select

            value={categoryFilter}

            onChange={(e)=>

              setCategoryFilter(e.target.value)

            }

          >

            {

              categories.map((item,index)=>(

                <option

                  key={index}

                  value={item}

                >

                  {item}

                </option>

              ))

            }

          </select>



          <select

            value={statusFilter}

            onChange={(e)=>

              setStatusFilter(e.target.value)

            }

          >

            <option>All</option>

            <option>Active</option>

            <option>Inactive</option>

            <option>Out Of Stock</option>

          </select>



          <select

            value={stockFilter}

            onChange={(e)=>

              setStockFilter(e.target.value)

            }

          >

            <option>All</option>

            <option>Low</option>

            <option>Out</option>

          </select>



          <select

            value={sortBy}

            onChange={(e)=>

              setSortBy(e.target.value)

            }

          >

            <option>Newest</option>

            <option>Oldest</option>

            <option>Price Low</option>

            <option>Price High</option>

          </select>

        </div>



        {/* View Buttons */}

        <div className="pm-view-toggle">

          <button

            className={

              viewMode==="table"

              ? "active"

              : ""

            }

            onClick={handleTableView}

          >

            <FiList />

          </button>



          <button

            className={

              viewMode==="grid"

              ? "active"

              : ""

            }

            onClick={handleGridView}

          >

            <FiGrid />

          </button>

        </div>

      </div>
      {/* ===========================
        PRODUCT TABLE
=========================== */}

{
loading ?

<div className="pm-loading">

Loading Products...

</div>

:

<div className="pm-table-wrapper">

<table className="pm-table">

<thead>

<tr>

<th>Product</th>

<th>Vendor</th>

<th>Category</th>

<th>Price</th>

<th>Inventory</th>
<th>Sold</th>
<th>Status</th>

<th>Rating</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{

currentProducts.length===0 ?

<tr>

<td
colSpan="10"
className="pm-empty"
>

No Products Found

</td>

</tr>

:

currentProducts.map(product=>(

<tr key={product._id}>

{/* PRODUCT */}

<td>

<div className="pm-product-cell">

<img

src={

product.thumbnail ||

product.images?.[0]

}

alt={product.name}

/>

<div>

<h4>

{product.name}

</h4>
<p>{product.productId}</p>
<span>
{product.shortDescription}
</span>
</div>

</div>

</td>



{/* VENDOR */}

<td>

<div className="pm-vendor">

<h5>

{

product.vendorId?.name ||

product.vendorName

}

</h5>

<p>

{

product.vendorId?.email

}

</p>

</div>

</td>



{/* CATEGORY */}

<td>

<span className="pm-category">

{product.category}

</span>

</td>



{/* PRICE */}

<td>

<div className="pm-price">

<h4>

{formatPrice(product.price)}

</h4>

<p>

MRP :

{formatPrice(product.mrp)}
</p>

{

product.discount>0 &&

<span>

-{product.discount}%

</span>

}

</div>

</td>



{/* INVENTORY */}

<td>

<div>

<h4>

{product.stock}

</h4>

<span

className={

getStockColor(

product.stock,

product.minStock

)

}

>

{

product.stock===0

?

"Out"

:

product.stock<=product.minStock

?

"Low"

:

"In Stock"

}

</span>

</div>

</td>

<td>

    <span className="pm-sold">

        {product.sold}

    </span>

</td>

{/* STATUS */}

<td>

<span

className={

getStatusColor(

product.status

)

}

>

{product.status}

</span>

</td>



{/* RATING */}

<td>

⭐
{(product.rating || 0).toFixed(1)}

<br/>

<small>
    {product.reviews || 0} Reviews
</small>

</td>

{/* ACTIONS */}

<td>

<div className="pm-actions">

<button

className="view-btn"

title="View"

>

<FiEye/>

</button>



{/* <button

className="edit-btn"

title="Edit"

>

<FiEdit/>

</button> */}



<button

className="delete-btn"

title="Delete"

onClick={() =>

openDeleteModal(product)

}

>

<FiTrash2/>

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

}



{/* ===========================
      PAGINATION
=========================== */}

{

filteredProducts.length>0 && (

<div className="pm-pagination">

<button

onClick={previousPage}

disabled={currentPage===1}

>

<FiChevronLeft/>

Previous

</button>



<div className="pm-page-numbers">

{

Array.from(

{

length:totalPages

},

(_,index)=>(

<button

key={index}

className={

currentPage===index+1

?

"active"

:

""

}

onClick={()=>

goToPage(index+1)

}

>

{index+1}

</button>

)

)

}

</div>



<button

onClick={nextPage}

disabled={

currentPage===totalPages

}

>

Next

<FiChevronRight/>

</button>

</div>

)

}



{/* ===========================
      DELETE MODAL
=========================== */}

{

deleteModal && (

<div className="pm-modal-overlay">

<div className="pm-delete-modal">

<h3>

Delete Product

</h3>

<p>

Are you sure you want to delete

<strong>

{" "}

{selectedProduct?.name}

</strong>

?

</p>

<div className="pm-modal-buttons">

<button

className="cancel-btn"

onClick={closeDeleteModal}

>

Cancel

</button>



<button

className="delete-confirm-btn"

onClick={deleteProduct}

>

Delete

</button>

</div>

</div>

</div>

)

}

</div>

);

};

export default ProductManagement;