import mongoose from "mongoose";

const subCategorySchema=mongoose.Schema({
    categoryId:{
        type:String,
        required:true
    },
    categoryName:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

const subCategory=mongoose.model("SubCategory",subCategorySchema);
export default subCategory;