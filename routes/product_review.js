import express from "express";
import ProductReview from "../models/product_review.js";
import product from "../models/product.js";

const productReviewRouter = express.Router();

// CREATE PRODUCT REVIEW
productReviewRouter.post("/api/product-reviews", async (req, res) => {
  try {
    const {
      buyerId,
      email,
      fullName,
      productId,
      rating,
      reviews,
    } = req.body;

    const existingReview=await productReview.findOne({buyerId,productId});
    if(existingReview){
      return res.status(400).json({msg:"You have already  reviewed this product"})
    } 

    // Create review
    const productReview = new ProductReview({
      buyerId,
      email,
      fullName,
      productId,
      rating,
      reviews,
    });

    // Save to DB
    const savedReview = await productReview.save();

    //find the product associated with the review using the productId
    const foundProduct=await product.findById(productId);

    if(!foundProduct){
        return res.status(404).json({msg:'product not found'})
    }

    //Update the totalRating by incrementin it by 1
    foundProduct.totalRating+=1;

    foundProduct.averageRating=((foundProduct.averageRating*(foundProduct.totalRating-1))+ rating)/foundProduct.totalRating;
    //save the updated product back to the database
    await foundProduct.save()

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product review",
      error: error.message,
    });
  }
});

productReviewRouter.get('/api/product-reviews',async(req,res)=>{
  try {
    const reviews=await ProductReview.find();
    return res.status(400).json(reviews)
  } catch (e) {
    return res.status(500).json({"error":e.message})
  }
})

export default productReviewRouter;
