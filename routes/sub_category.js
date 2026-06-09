import express from 'express';
import subCategory from '../models/sub_category.js';

const subcategoryRouter=express.Router();

subcategoryRouter.post('/api/subcategories',async(req,res)=>{
    try {
        const {categoryId,categoryName,image,name}=req.body;
        const subcategory=new subCategory({categoryId,categoryName,image,name})
        await subcategory.save();
        return res.status(201).send(subcategory)
    } catch (e) {
        return res.status(500).json({error:e.message})
    }
})

subcategoryRouter.get('/api/category/:categoryName/subcategories',async(req,res)=>{
    try {
        const{categoryName}=req.params;
        const subcategories=await subCategory.find({categoryName:categoryName})
        if(!subcategories || subcategories.length==0){
            return res.status(404).json({message:"subcategories not found"})
        }else{
            return res.status(200).json(subcategories)
        }
    } catch (e) {
        return res.status(500).json({error:e.message})
    }
})

subcategoryRouter.get('/api/subcategories',async(req,res)=>{
    try {
        const response= await subCategory.find();
        return res.status(200).json(response);
    } catch (error) {
         return res.status(500).json({error:e.message})
    }
})
export default subcategoryRouter;