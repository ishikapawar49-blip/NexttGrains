import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
{
    /* ==========================================
       BASIC DETAILS
    ========================================== */

    title:{
        type:String,
        required:true,
        trim:true
    },

    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    shortDescription:{
        type:String,
        required:true,
        trim:true,
        maxlength:300
    },

    description:{
        type:String,
        required:true
    },

    /* ==========================================
       AUTHOR
    ========================================== */

    author:{
        type:String,
        required:true,
        default:"NexttGrains Editorial"
    },

    /* ==========================================
       IMAGES
    ========================================== */

    featuredImage:{
        type:String,
        default:""
    },

    bannerImage:{
        type:String,
        default:""
    },

    imageAlt:{
        type:String,
        default:""
    },

    /* ==========================================
       CATEGORY
    ========================================== */

    category:{
        type:String,
        required:true,
        enum:[
            "Rice",
            "Pulses",
            "Flours",
            "Millets",
            "Spices",
            "Dry Fruits",
            "Organic",
            "Recipes",
            "Health",
            "Lifestyle",
            "News",
            "Others"
        ]
    },

    /* ==========================================
       TAGS
    ========================================== */

    tags:[
        {
            type:String,
            trim:true
        }
    ],

    /* ==========================================
       STATUS
    ========================================== */

    status:{
        type:String,
        enum:[
            "Draft",
            "Published"
        ],
        default:"Draft"
    },

    featured:{
        type:Boolean,
        default:false
    },

    /* ==========================================
       STATS
    ========================================== */

    views:{
        type:Number,
        default:0
    },

    likes:{
        type:Number,
        default:0
    },

    shares:{
        type:Number,
        default:0
    },

    readingTime:{
        type:Number,
        default:5
    },
        /* ==========================================
       SEO
    ========================================== */

    metaTitle:{
        type:String,
        default:"",
        trim:true
    },

    metaDescription:{
        type:String,
        default:"",
        trim:true
    },

    keywords:[
        {
            type:String,
            trim:true
        }
    ],

    canonicalUrl:{
        type:String,
        default:""
    },

    /* ==========================================
       PUBLISH DETAILS
    ========================================== */

    publishedAt:{
        type:Date,
        default:null
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true,

    toJSON:{
        virtuals:true
    },

    toObject:{
        virtuals:true
    }
}
);

/* ==========================================================
   VIRTUAL : WORD COUNT
========================================================== */

blogSchema.virtual("wordCount").get(function(){

    if(!this.description){

        return 0;

    }

    return this.description
        .replace(/<[^>]*>/g," ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

});

/* ==========================================================
   VIRTUAL : IS PUBLISHED
========================================================== */

blogSchema.virtual("isPublished").get(function(){

    return this.status==="Published";

});

/* ==========================================================
   AUTO SLUG
========================================================== */

blogSchema.pre("validate",function(){

    if(!this.slug && this.title){

        this.slug=this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g,"")
        .replace(/\s+/g,"-")
        .replace(/-+/g,"-");

    }

});

/* ==========================================================
   AUTO PUBLISH DATE
========================================================== */

blogSchema.pre("save",function(){

    if(this.status==="Published" && !this.publishedAt){

        this.publishedAt=new Date();

    }

});

/* ==========================================================
   INDEXES
========================================================== */

blogSchema.index({
    title:"text",
    shortDescription:"text",
    description:"text"
});

blogSchema.index({
    slug:1
});

blogSchema.index({
    category:1
});

blogSchema.index({
    status:1
});

blogSchema.index({
    featured:1
});

blogSchema.index({
    createdAt:-1
});

blogSchema.index({
    publishedAt:-1
});

blogSchema.index({
    views:-1
});

blogSchema.index({
    isDeleted:1
});

/* ==========================================================
   EXPORT MODEL
========================================================== */

const Blog=
mongoose.models.Blog ||
mongoose.model("Blog",blogSchema);

export default Blog;