import express from "express";
import Category from "../models/category.js";

const categoryRooter=express.Router();

categoryRooter.post('/api/category',async(req,res)=>{
    try {
        const {name,image,banner}=req.body;
        const category= new Category({name,image,banner});
        await category.save();
        return res.status(201).send(category);
    } catch (e) {
        return res.status(500).json({error:e.message})
    }
})

categoryRooter.get('/api/category',async(req,res)=>{
    try {
       const category= await Category.find();
       return res.status(201).json(category);
    } catch (e) {
        return res.status(500).json({error:e.message})
    }
})

export default categoryRooter;