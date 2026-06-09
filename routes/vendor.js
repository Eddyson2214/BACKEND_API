import express from "express";
import Vendor from "../models/vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const vendorRouter=express.Router();

vendorRouter.post('/api/vendor/signup',async(req,res)=>{
    try {
        const {fullName,email,password}=req.body;
        //Check if the email doesnt exit yet
        const existingemail=await Vendor.findOne({email})
        if(existingemail){
            return res.status(400).json({msg:"Vendor with same email already exist"})
        }else{
            //generate a salt with a cost factor of 10
            const salt=await bcrypt.genSalt(10)
            //hash password using the generated salt
            const hashpassword=await bcrypt.hash(password,salt);
           var vendor= new Vendor({fullName,email,password:hashpassword});
           vendor=await vendor.save();
           res.json({vendor})
        }
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})


vendorRouter.post('/api/vendor/signin',async(req,res)=>{
   try {
    const{email,password}=req.body;
    const findUser=await Vendor.findOne({email});
    if(!findUser){
        return res.status(400).json({msg:"Vendor not found with email"})
    }
    else{
       const isMatch= await bcrypt.compare(password,findUser.password);
       if(!isMatch){
        return res.status(400).json({msg:"The password is wrong"})
       }else{
        const token=jwt.sign({id:findUser._id},"passwordkey");
        //remove the password
        const{password,...vendorWithoutPassword}=findUser._doc;

        //send the responses
        res.json({token,vendor:vendorWithoutPassword})

       }
    }
   } catch (e) {
     res.status(500).json({error:e.message});
   }
})

//fetch all vendor(exclude password)
vendorRouter.get('/api/vendors',async(req,res)=>{
    try {
        const vendors=await Vendor.find().select('-password')//Exclude password field
        return res.status(200).json(vendors);
    } catch (e) {
        res.status(500).json({error:e.message})
    }
})

export default vendorRouter;