import mongoose from "mongoose";

const productReviewsSchema=mongoose.Schema({
    buyerId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    reviews:{
        type:String,
        required:true
    }
});

const ProductReview=mongoose.model("ProductReview",productReviewsSchema);
export default ProductReview;