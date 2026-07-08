import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// cloudinary image upload
const uploadToCloudinary = (file, folder) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {

                folder

            },

            (error, result) => {

                if (error) {

                    reject(error);

                } else {

                    resolve(result);

                }

            }

        );

        streamifier

            .createReadStream(file.buffer)

            .pipe(stream);

    });

};

/* ==========================================================
   CREATE BLOG
========================================================== */

export const createBlog = async (req, res) => {

    try{

        console.log("REQ BODY =>",req.body);

        const{

            title,
            slug,
            shortDescription,
            description,

            author,

            // featuredImage,
            // bannerImage,
            imageAlt,

            category,
            tags,

            status,
            featured,

            readingTime,

            metaTitle,
            metaDescription,
            keywords,
            canonicalUrl

        }=req.body;

        /* =====================================
            VALIDATION
        ===================================== */

        if(

            !title ||
            !shortDescription ||
            !description ||
            !category

        ){

            return res.status(400).json({

                success:false,

                message:"Please fill all required fields."

            });

        }

        /* =====================================
            CHECK DUPLICATE TITLE
        ===================================== */

        const titleExists=await Blog.findOne({

            title:title.trim(),

            isDeleted:false

        });

        if(titleExists){

            return res.status(400).json({

                success:false,

                message:"Blog title already exists."

            });

        }

        /* =====================================
            CREATE SLUG
        ===================================== */

        const generatedSlug=

        slug && slug.trim()!=="" ?

        slug.toLowerCase().trim()

        .replace(/[^\w\s-]/g,"")

        .replace(/\s+/g,"-")

        .replace(/-+/g,"-")

        :

        title.toLowerCase().trim()

        .replace(/[^\w\s-]/g,"")

        .replace(/\s+/g,"-")

        .replace(/-+/g,"-");

        /* =====================================
            CHECK SLUG
        ===================================== */

        const slugExists=await Blog.findOne({

            slug:generatedSlug,

            isDeleted:false

        });

        if(slugExists){

            return res.status(400).json({

                success:false,

                message:"Slug already exists."

            });

        }

// images upload
let featuredImageUrl = "";

let bannerImageUrl = "";

if (

    req.files?.featuredImage?.length

) {

    const uploaded = await uploadToCloudinary(

        req.files.featuredImage[0],

        "nexttgrains/blogs/featured"

    );

    featuredImageUrl = uploaded.secure_url;

}

if (

    req.files?.bannerImage?.length

) {

    const uploaded = await uploadToCloudinary(

        req.files.bannerImage[0],

        "nexttgrains/blogs/banner"

    );

    bannerImageUrl = uploaded.secure_url;

}
        /* =====================================
            CREATE BLOG
        ===================================== */

        const blog=await Blog.create({

            title:title.trim(),

            slug:generatedSlug,

            shortDescription:shortDescription.trim(),

            description,

            author:

            author && author.trim()!=="" ?

            author :

            "NexttGrains Editorial",

            featuredImage: featuredImageUrl,

bannerImage: bannerImageUrl,

            imageAlt,

            category,

           tags:

tags

?

JSON.parse(tags)

:

[],

            status:

            status || "Draft",

            featured:

            featured || false,

            readingTime:

            Number(readingTime || 5),

            metaTitle,

            metaDescription,

            keywords:

keywords

?

JSON.parse(keywords)

:

[],

            canonicalUrl,

            createdBy:null

        });

        return res.status(201).json({

            success:true,

            message:"Blog created successfully.",

            blog

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
/* ==========================================================
   GET ALL BLOGS
========================================================== */

export const getBlogs = async (req, res) => {

    try{

        const{

            page=1,
            limit=10,

            search="",

            status,

            category,

            featured,

            sort="latest"

        }=req.query;

        /* =====================================
            FILTER
        ===================================== */

        const filter={

            isDeleted:false

        };

        if(search){

            filter.$or=[

                {

                    title:{
                        $regex:search,
                        $options:"i"
                    }

                },

                {

                    shortDescription:{
                        $regex:search,
                        $options:"i"
                    }

                },

                {

                    author:{
                        $regex:search,
                        $options:"i"
                    }

                },

                {

                    category:{
                        $regex:search,
                        $options:"i"
                    }

                }

            ];

        }

        if(status){

            filter.status=status;

        }

        if(category){

            filter.category=category;

        }

        if(featured==="true"){

            filter.featured=true;

        }

        /* =====================================
            SORTING
        ===================================== */

        let sortOption={

            createdAt:-1

        };

        switch(sort){

            case "oldest":

                sortOption={

                    createdAt:1

                };

                break;

            case "title":

                sortOption={

                    title:1

                };

                break;

            case "views":

                sortOption={

                    views:-1

                };

                break;

            case "published":

                sortOption={

                    publishedAt:-1

                };

                break;

            default:

                sortOption={

                    createdAt:-1

                };

        }

        /* =====================================
            PAGINATION
        ===================================== */

        const currentPage=Number(page);

        const perPage=Number(limit);

        const skip=(currentPage-1)*perPage;

        /* =====================================
            FETCH BLOGS
        ===================================== */

        const blogs=await Blog.find(filter)

        .sort(sortOption)

        .skip(skip)

        .limit(perPage)

        .populate(

            "createdBy",

            "name email"

        )

        .populate(

            "updatedBy",

            "name email"

        );

        const totalBlogs=

        await Blog.countDocuments(filter);

        /* =====================================
            DASHBOARD STATS
        ===================================== */

        const totalPublished=

        await Blog.countDocuments({

            status:"Published",

            isDeleted:false

        });

        const totalDraft=

        await Blog.countDocuments({

            status:"Draft",

            isDeleted:false

        });

        const totalFeatured=

        await Blog.countDocuments({

            featured:true,

            isDeleted:false

        });

        const totalViews=

        await Blog.aggregate([

            {

                $match:{

                    isDeleted:false

                }

            },

            {

                $group:{

                    _id:null,

                    total:{

                        $sum:"$views"

                    }

                }

            }

        ]);

        return res.status(200).json({

            success:true,

            blogs,

            pagination:{

                currentPage,

                perPage,

                totalBlogs,

                totalPages:

                Math.ceil(

                    totalBlogs/perPage

                )

            },

            stats:{

                totalBlogs,

                totalPublished,

                totalDraft,

                totalFeatured,

                totalViews:

                totalViews.length

                ?

                totalViews[0].total

                :

                0

            }

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   GET BLOG BY ID
========================================================== */

export const getBlogById = async (req, res) => {

    try{

        const { id } = req.params;

        const blog = await Blog.findOne({

            _id:id,

            isDeleted:false

        })

        .populate("createdBy","name email")

        .populate("updatedBy","name email");

        if(!blog){

            return res.status(404).json({

                success:false,

                message:"Blog not found."

            });

        }

        return res.status(200).json({

            success:true,

            blog

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   UPDATE BLOG
========================================================== */

export const updateBlog = async (req, res) => {

    try{

        const { id } = req.params;

        const blog = await Blog.findOne({

            _id:id,

            isDeleted:false

        });

        if(!blog){

            return res.status(404).json({

                success:false,

                message:"Blog not found."

            });

        }

        const{

            title,

            slug,

            shortDescription,

            description,

            author,

            featuredImage,

            bannerImage,

            imageAlt,

            category,

            tags,

            status,

            featured,

            readingTime,

            metaTitle,

            metaDescription,

            keywords,

            canonicalUrl

        }=req.body;

        /* =====================================
            DUPLICATE TITLE
        ===================================== */

        if(title){

            const titleExists=

            await Blog.findOne({

                title:title.trim(),

                _id:{

                    $ne:id

                },

                isDeleted:false

            });

            if(titleExists){

                return res.status(400).json({

                    success:false,

                    message:"Blog title already exists."

                });

            }

            blog.title=title.trim();

        }

        /* =====================================
            UPDATE SLUG
        ===================================== */

        if(slug){

            const newSlug=

            slug

            .toLowerCase()

            .trim()

            .replace(/[^\w\s-]/g,"")

            .replace(/\s+/g,"-")

            .replace(/-+/g,"-");

            const slugExists=

            await Blog.findOne({

                slug:newSlug,

                _id:{

                    $ne:id

                },

                isDeleted:false

            });

            if(slugExists){

                return res.status(400).json({

                    success:false,

                    message:"Slug already exists."

                });

            }

            blog.slug=newSlug;

        }

        /* =====================================
            UPDATE FIELDS
        ===================================== */

        if(shortDescription!==undefined)

            blog.shortDescription=shortDescription;

        if(description!==undefined)

            blog.description=description;

        if(author!==undefined)

            blog.author=author;

if(req.files?.featuredImage?.length){

const uploaded=

await uploadToCloudinary(

req.files.featuredImage[0],

"nexttgrains/blogs/featured"

);

blog.featuredImage=

uploaded.secure_url;

}

if(req.files?.bannerImage?.length){

const uploaded=

await uploadToCloudinary(

req.files.bannerImage[0],

"nexttgrains/blogs/banner"

);

blog.bannerImage=

uploaded.secure_url;

}

        if(imageAlt!==undefined)

            blog.imageAlt=imageAlt;

        if(category!==undefined)

            blog.category=category;

        if(tags!==undefined)

            blog.tags=tags;

        if(status!==undefined)

            blog.status=status;

        if(featured!==undefined)

            blog.featured=featured;

        if(readingTime!==undefined)

            blog.readingTime=Number(readingTime);

        if(metaTitle!==undefined)

            blog.metaTitle=metaTitle;

        if(metaDescription!==undefined)

            blog.metaDescription=metaDescription;

        if(keywords!==undefined)

            blog.keywords=keywords;

        if(canonicalUrl!==undefined)

            blog.canonicalUrl=canonicalUrl;

        blog.updatedBy=null;

        await blog.save();

        return res.status(200).json({

            success:true,

            message:"Blog updated successfully.",

            blog

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   DELETE BLOG (SOFT DELETE)
========================================================== */

export const deleteBlog = async (req, res) => {

    try{

        const { id } = req.params;

        const blog = await Blog.findOne({

            _id:id,

            isDeleted:false

        });

        if(!blog){

            return res.status(404).json({

                success:false,

                message:"Blog not found."

            });

        }

        blog.isDeleted = true;

        blog.updatedBy = null;

        await blog.save();

        return res.status(200).json({

            success:true,

            message:"Blog deleted successfully."

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   CHANGE BLOG STATUS
========================================================== */

export const changeBlogStatus = async (req, res) => {

    try{

        const { id } = req.params;

        const { status } = req.body;

        if(!["Draft","Published"].includes(status)){

            return res.status(400).json({

                success:false,

                message:"Invalid blog status."

            });

        }

        const blog = await Blog.findOne({

            _id:id,

            isDeleted:false

        });

        if(!blog){

            return res.status(404).json({

                success:false,

                message:"Blog not found."

            });

        }

        blog.status = status;

        if(

            status==="Published" &&

            !blog.publishedAt

        ){

            blog.publishedAt=new Date();

        }

        blog.updatedBy=null;

        await blog.save();

        return res.status(200).json({

            success:true,

            message:"Blog status updated successfully.",

            blog

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   INCREMENT BLOG VIEWS
========================================================== */

export const incrementBlogViews = async (req, res) => {

    try{

        const { id } = req.params;

        const blog = await Blog.findOne({

            _id:id,

            isDeleted:false,

            status:"Published"

        });

        if(!blog){

            return res.status(404).json({

                success:false,

                message:"Blog not found."

            });

        }

        blog.views += 1;

        await blog.save();

        return res.status(200).json({

            success:true,

            views:blog.views

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

/* ==========================================================
   GET PUBLISHED BLOGS
========================================================== */

export const getPublishedBlogs = async (req, res) => {

    try{

        const blogs = await Blog.find({

            status:"Published",

            isDeleted:false

        })

        .sort({

            publishedAt:-1

        })

        .select(

            "-isDeleted"

        );

        return res.status(200).json({

            success:true,

            count:blogs.length,

            blogs

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};