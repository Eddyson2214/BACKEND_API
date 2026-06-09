import express from "express";
import Order from "../models/order.js";
import { auth, vendorAuth } from "../middleware/auth.js";
const OrderRouter=express.Router();


//Post route for creating orders
OrderRouter.post('/api/orders',auth,async(req,res)=>{
try {
    const {
          fullName
           ,email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            vendorId,
            buyerId,
        }=req.body;

    const createdAt=new Date().getMilliseconds()// Get the current date

    //create new order instance with the extracted field
    const order=new Order({
           fullName
           ,email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            vendorId,
            buyerId,
            createdAt
    })

    await order.save()

    return res.status(201).json(order)
} catch (e) {
    res.status(500).json({error:e.message})
}
})

//Get route for fetching orders by buyer ID
OrderRouter.get('/api/orders/:buyerId',auth,async(req,res)=>{
    try {
        //Extract the buyerId from the request parameters
        const {buyerId}=req.params
        //Final all orders in the databse that match the buyerId
       const orders= await Order.find({buyerId})
       //If no orders not found, return a 404 status with a message
       if(orders.length==0){
        return res.status(404).json({msg:'No orders found for this buyer'})
       }else{
        //If orders are found return them with 200 status code
        return res.status(200).json(orders);
       }
    } catch (error) {
        //Any error
        return res.status(500).json({e:error.message})
    }
})

//Delete route for Deleting a specifi order by id;
OrderRouter.delete("/api/orders/:id",auth,async(req,res)=>{
    try {
        //extract the id from the request parameter
        const {id}=req.params;
        //find and delete the order forom the data base using the extracted _id
        const deletedOrder= await Order.findByIdAndDelete(id)
        //If order was found and deleted
        if(!deletedOrder){
            //if no order was found with the provider _id return 404
            return res.status(404).json({msg:"Order not found"})
        }
        else{
            //if the order was successfully deleted ,return 200 status with a success message
            return res.status(200).json({msg:"Order was deleted successfully"})

        }
    } catch (error) {
        //if there is any error
        res.status(500).json({e:error.message})
    }
})

//Get route for fetching orders by vendor ID
OrderRouter.get('/api/orders/vendor/:vendorId',auth,vendorAuth,async(req,res)=>{
    try {
        //Extract the buyerId from the request parameters
        const {vendorId}=req.params
        //Final all orders in the databse that match the buyerId
       const orders= await Order.find({vendorId})
       //If no orders not found, return a 404 status with a message
       if(orders.length==0){
        return res.status(404).json({msg:'No orders found for this buyer'})
       }else{
        //If orders are found return them with 200 status code
        return res.status(200).json(orders);
       }
    } catch (error) {
        //Any error
        return res.status(500).json({e:error.message})
    }
})

OrderRouter.patch('/api/orders/:id/delivered',async(req,res)=>{
    try {
        const{id}=req.params;
      const updatedOrder=  await Order.findByIdAndUpdate(
            id,
            {delivered:true,proccessing:false},
            {new:true}
        )
        if(!updatedOrder){
            return res.status(404).json({msg:"Order not found"})
        }else{
            return res.status(200).json(updatedOrder)
        }
    } catch (error) {
          return res.status(500).json({e:error.message})
    }
})

OrderRouter.patch('/api/orders/:id/processing',async(req,res)=>{
    try {
        const{id}=req.params;
      const updatedOrder=  await Order.findByIdAndUpdate(
            id,
            {processing:false,delivered:false},
            {new:true}
        )
        if(!updatedOrder){
            return res.status(404).json({msg:"Order not found"})
        }else{
            return res.status(200).json(updatedOrder)
        }
    } catch (error) {
          return res.status(500).json({e:error.message})
    }
})

OrderRouter.get('/api/orders',async(req,res)=>{
    try {
        const orders= await Order.find()
        return res.status(200).json(orders)
    } catch (e) {
        return res.json(500).json({error:e.message})
    }
})


export default OrderRouter;