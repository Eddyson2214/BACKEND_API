import express from "express";
import Product from "../models/product.js";
import { auth,vendorAuth } from "../middleware/auth.js";


const productRouter = express.Router();

// CREATE PRODUCT
productRouter.post("/api/add-product",auth,vendorAuth, async (req, res) => {
  try {
    const product = new Product({
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      quantity: req.body.quantity,
      description: req.body.description,
      Category: req.body.Category,
      VendorId:req.body.VendorId,
      fullName:req.body.fullName,
      subCategory: req.body.subCategory,
      images: req.body.images,        // must be array
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

productRouter.get('/api/popular-product',async(req,res)=>{
  try {
    const product=await Product.find({popular:true});
    if(!product || product.length==0){
      return res.status(404).json({msg:'products not found'});
    }else{
      return res.status(200).json(product)
    }
  } catch (e) {
    return res.status(400).json({error:e.message})
  }
});

productRouter.get('/api/recommend-product',async(req,res)=>{
  try {
    const product=await Product.find({recommend:true});
    if(!product || product.length==0){
      return res.status(404).json({msg:' recommend products not found'});
    }else{
      return res.status(201).json({product})
    }
  } catch (e) {
    return res.status(400).json({error:e.message})
  }
});

//route retrieving products by category
productRouter.get('/api/products-by-category/:category',async(req,res)=>{
  try {
      const { category } = req.params;
     const products = await Product.find({ Category: category,popular:true });
     if(!products|| products.length==0){
      return res.status(404).json({msg:"Product no found"})
     }else{
      return res.status(200).json(products)
     }
  } catch (error) {
    return res.status(500).json({e:error.message})
  }
})

//new route for retrieving related product by subcategory
productRouter.get('/api/related/products-by-subcategory/:productId',async(req,res)=>{
  try {
    const {productId}=req.params;
    //first find the product to get the subcategory;
    const product=await  Product.findById(productId);
    if(!product){
      res.status(404).json({msg:"Product not found"});
    }else{
      //find related products base on the subcategory of the retrieved product
      const relatedProducts=await Product.find({
        subCategory:product.subCategory,
        _id:{$ne:productId}//Exclude the current product
      })
      if(!relatedProducts||relatedProducts.length==0){
        return res.status(404).json({msg:"No related product found"})
      }else{
        return res.status(200).json(relatedProducts);
      }
    }
  } catch (e) {
    return res.status(500).json({error:e.message})
  }
})

//route for retrieving the top 10 highest-rated products

productRouter.get('/api/top-rated-products',async(req,res)=>{
  try {
    //fetch all product and sort them by average rating and descending order(highest rating)
    const topRatingPorducts= await Product.find({}).sort({averageRating:-1})//sort product by averageRating with -1 indicated descending
         .limit(1)//get the top 10 highest product
    //if there are any top-rated products returned
    if(!topRatingPorducts||topRatingPorducts.length==0){
        return res.status(404).json({msg:"No top-rated products found"})
    }

    //return the top-rated product as a response
    return res.status(200).json(topRatingPorducts)
  } catch (e) {
    return res.status(500).json({error:e.message})
  }
})
//Route searching product by subcategory
productRouter.get('/api/products-by-subcategory:subCategory',async(req,res)=>{
  try {
    const {subCategory}=req.params;
    const products= await Product.find({subCategory:subCategory});
    if(!products || products.length==0){
      return res.status(404).json({msg:"No products found in this category"})
    }
    return res.status(200).json(products)
  } catch (e) {
   return res.status(500).json({error:e.message})
  }
})

//Route searching products product by name or products
productRouter.get('/api/search-products',async(req,res)=>{
  try {
    const{query}=req.query;
    //validate the query parameter is provided
    //if missing return a 400 status with an error message

    if(!query){
      return res.status(400).json({msg:"Query parameter required"})
    }
    //search the Product collection for documents where either 'productName or descriptiion'
    //contains the specified query String
    const products=await Product.find({
      $or:[
        //Regex will match any product Name containin the query String,
        //For example if the user search for "apple", the regex will check 
        //if "apple" is part of any ProductName, so products name "Green Apple pie"
        //or "Fresh Apples" would all match because they contain the world "apple"
        {productName:{$regex:query,options:"i"}},
        {description:{$regex:query,options:"i"}}
      ]
    })
//check any products found 
    if (!products ||products.length==0){
      return res.status(404).json({msg:"No products found matching the query"})
    }

    //product found
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({error:e.message})
  }
})

//Route to edit an existing product
productRouter.put('/api/edit-product/:productId',auth,vendorAuth,async(req,res)=>{
  try {
    ////Extract the product id from the request parameter
    const{productId}=req.params;
    //check if the product exist and if the vendor is authorized to edit it
     const product =await Product.findById(productId);
     if (!product){
      return res.status(404).json({msg:"Product not found"});
     }
     if(product.VendorId.toString()!==req.user.id){
      return res.status(403).json({msg:"Unauthorized to edit this product"})
    }
    //Destructure req.body to exclude vendorid
    const{vendorId,...udpdateData}=req.body;
    //updata the product with the fields provided in updateData
    const updatedProduct= await Product.findByIdAndUpdate(
      productId,{
        $set:udpdateData//update only fields in the update data
      },
      {
        new:true//return the updated data product document in the response
      }
    )
    //return the update data with 200 status
    return res.status(200).json({msg:"product updated"})
  } catch (e) {
    return res.status(500).json({error:e.message})
  }
})
export default productRouter;
