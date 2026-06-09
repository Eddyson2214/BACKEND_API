import mongoose from "mongoose";

const productSchema=mongoose.Schema({
    productName:{
        type:String,
        trim:true,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    VendorId:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    images:[
        {
            type:String,
            required:true
        }
    ],
    popular:{
        type:Boolean,
        default:true
    },
    recommend:{
        type:Boolean,
        default:false
    },

    //Add these fields for rating
    averageRating:{
        type:Number,
        default:0
    },
    totalRating:{
        type:Number,
        default:0
    }
})

const product=mongoose.model('Product',productSchema)

export default product;