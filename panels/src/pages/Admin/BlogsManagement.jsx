import "./BlogsManagement.css";

import { useEffect, useState } from "react";
import axios from "axios";

import BlogsAdd from "./BlogsAdd";

import {

    FaSearch,

    FaPlus,

    FaEye,

    FaEdit,

    FaTrash,

    FaNewspaper,

    FaCheckCircle,

    FaClock,

    FaChartLine

} from "react-icons/fa";

const API="http://localhost:5000/api/blogs";

function BlogsManagement(){

const[blogs,setBlogs]=useState([]);

const[loading,setLoading]=useState(false);

const[search,setSearch]=useState("");

const[showModal,setShowModal]=useState(false);

const[selectedBlog,setSelectedBlog]=useState(null);

const[stats,setStats]=useState({

totalBlogs:0,

totalPublished:0,

totalDraft:0,

totalViews:0

});

/* ===========================================
        FETCH BLOGS
=========================================== */

const fetchBlogs=async()=>{

try{

setLoading(true);

const res=await axios.get(API);

setBlogs(res.data.blogs || []);

if(res.data.stats){

setStats(res.data.stats);

}

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};

useEffect(()=>{

fetchBlogs();

},[]);

/* ===========================================
        DELETE BLOG
=========================================== */

const deleteBlog=async(id)=>{

const confirmDelete=

window.confirm(

"Delete this blog?"

);

if(!confirmDelete) return;

try{

await axios.delete(

`${API}/delete/${id}`

);

fetchBlogs();

}

catch(error){

console.log(error);

}

};

/* ===========================================
        FILTER
=========================================== */

const filteredBlogs=

blogs.filter((blog)=>{

return(

blog.title

.toLowerCase()

.includes(

search.toLowerCase()

)

||

blog.author

.toLowerCase()

.includes(

search.toLowerCase()

)

||

blog.category

.toLowerCase()

.includes(

search.toLowerCase()

)

);

});
return(

<div className="blogs-management">

<div className="blogs-header">

<div>

<h1>

Blogs

</h1>

<p>

Editorial calendar and SEO-driven articles

</p>

</div>

<button

className="blogs-create-btn"

onClick={()=>{

setSelectedBlog(null);

setShowModal(true);

}}

>

<FaPlus/>

New Blog

</button>

</div>
<div className="blogs-stats">

<div className="blogs-stat-card">

<div>

<span>Total Blogs</span>

<h2>

{stats.totalBlogs}

</h2>

</div>

<div className="blogs-icon green">

<FaNewspaper/>

</div>

</div>

<div className="blogs-stat-card">

<div>

<span>Published</span>

<h2>

{stats.totalPublished}

</h2>

</div>

<div className="blogs-icon green">

<FaCheckCircle/>

</div>

</div>

<div className="blogs-stat-card">

<div>

<span>Draft</span>

<h2>

{stats.totalDraft}

</h2>

</div>

<div className="blogs-icon blogs-yellow">

<FaClock/>

</div>

</div>

<div className="blogs-stat-card">

<div>

<span>Total Views</span>

<h2>

{stats.totalViews}

</h2>

</div>

<div className="blogs-icon blogs-green">

<FaChartLine/>

</div>

</div>

</div>
<div className="blogs-search-box">

<FaSearch/>

<input

type="text"

placeholder="Search blogs..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>

</div>
      {/* =====================================================
            TABLE
      ===================================================== */}

      <div className="blogs-table-wrapper">

        <table className="blogs-table">

          <thead>

            <tr>

              <th>

                <input type="checkbox"/>

              </th>

              <th>Blog</th>

              <th>Author</th>

              <th>Category</th>

              <th>Views</th>

              <th>Status</th>

              <th>Updated</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {

            loading ?

            (

              <tr>

                <td
                  colSpan="8"
                  className="blogs-empty"
                >

                  Loading blogs...

                </td>

              </tr>

            )

            :

            filteredBlogs.length===0 ?

            (

              <tr>

                <td
                  colSpan="8"
                  className="blogs-empty"
                >

                  No Blogs Found

                </td>

              </tr>

            )

            :

            (

              filteredBlogs.map((blog)=>(

                <tr key={blog._id}>

                  <td>

                    <input
                      type="checkbox"
                    />

                  </td>

                  {/* ================= BLOG ================= */}

                  <td>

                    <div className="blog-info">

                      <img

                        src={

                          blog.featuredImage ||

                          "https://placehold.co/80x60"

                        }

                        alt={blog.title}

                      />

                      <div>

                        <h4>

                          {blog.title}

                        </h4>

                        <span>

                          {blog.slug}

                        </span>

                      </div>

                    </div>

                  </td>

                  {/* ================= AUTHOR ================= */}

                  <td>

                    {blog.author}

                  </td>

                  {/* ================= CATEGORY ================= */}

                  <td>

                    <span className="blog-category">

                      {blog.category}

                    </span>

                  </td>

                  {/* ================= VIEWS ================= */}

                  <td>

                    {blog.views}

                  </td>

                  {/* ================= STATUS ================= */}

                  <td>

                    <span

                      className={

                        `blog-status ${

                        blog.status==="Published"

                        ?

                        " blog-status-published"

                        :

                        "blog-status-draft"

                        }`

                      }

                    >

                      {

                        blog.status

                      }

                    </span>

                  </td>

                  {/* ================= UPDATED ================= */}

                  <td>

                    {

                      blog.updatedAt

                      ?

                      new Date(

                        blog.updatedAt

                      )

                      .toLocaleDateString()

                      :

                      "-"

                    }

                  </td>

                  {/* ================= ACTIONS ================= */}

                  <td>

                    <div className="blog-actions">

                      <button

                        className="blog-view-btn"

                        title="View"

                      >

                        <FaEye/>

                      </button>

                      <button

                        className="blog-edit-btn"

                        onClick={()=>{

                          setSelectedBlog(blog);

                          setShowModal(true);

                        }}

                        title="Edit"

                      >

                        <FaEdit/>

                      </button>

                      <button

                        className="blog-delete-btn"

                        onClick={()=>

                        deleteBlog(blog._id)

                        }

                        title="Delete"

                      >

                        <FaTrash/>

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )

            }

          </tbody>

        </table>

      </div>
            {/* ==========================================
            FOOTER
      ========================================== */}

      <div className="blogs-footer">

        <span>

          Showing

          {" "}

          {filteredBlogs.length}

          {" "}

          Blogs

        </span>

      </div>

      {/* ==========================================
            MODAL
      ========================================== */}

      {

      showModal &&

      (

        <BlogsAdd

          blog={selectedBlog}

          refreshBlogs={fetchBlogs}

          onClose={()=>

          setShowModal(false)

          }

        />

      )

      }

    </div>

);

}

export default BlogsManagement;