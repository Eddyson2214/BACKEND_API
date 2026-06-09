import express from "express";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const authRouter=express.Router();

authRouter.post('/api/signup',async(req,res)=>{
    try {
        const {fullName,email,password}=req.body;
        //Check if the email doesnt exit yet
        const existingemail=await User.findOne({email})
        if(existingemail){
            return res.status(400).json({msg:"User with same email already exist"})
        }else{
            //generate a salt with a cost factor of 10
            const salt=await bcrypt.genSalt(10)
            //hash password using the generated salt
            const hashpassword=await bcrypt.hash(password,salt);
           var user= new User({fullName,email,password:hashpassword});
           user=await user.save();
           res.json({user})
        }
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})

authRouter.post('/api/signin',async(req,res)=>{
   try {
    const{email,password}=req.body;
    const findUser=await User.findOne({email});
    if(!findUser){
        return res.status(400).json({msg:"User not found with email"})
    }
    else{
       const isMatch= await bcrypt.compare(password,findUser.password);
       if(!isMatch){
        return res.status(400).json({msg:"The password is wrong"})
       }else{
        const token=jwt.sign({id:findUser._id},"passwordkey");
        //remove the password
        const{password,...userWithoutPassword}=findUser._doc;

        //send the responses
        res.json({token,user:userWithoutPassword})

       }
    }
   } catch (e) {
     res.status(500).json({error:e.message});
   }
})

//Put route for updating user's state,city and locality
authRouter.put('/api/users/:id',async(req,res)=>{
    try {
        //Extract the 'id' parameter from the request  URl
        const{id}=req.params;
        //Extract the "state","city" and locacity from the request body
        const{state,city,locality}=req.body;
        //find the user by the Id and update the sate,city,locality fields
        //the {new:true} option ensures the update document is returned
        const udpatedUser=await User.findByIdAndUpdate(
            id,{ state,city,locality},
            {new:true}
        )
        //if user is not found ,return 4040 page not found with an error message
        if(!udpatedUser){
            return res.status(404).json({error:"User not found"})
        }else{
            return res.status(200).json(udpatedUser)
        }

    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

authRouter.get('/api/users',async(req,res)=>{
    try {
        const users= await User.find().select('-password');
        return res.status(200).json(users);
    } catch (e) {
        res.status(500).json({error:e.message})
    }
})

export default authRouter;