import User from "../models/users.js";
import Vendor from "../models/vendor.js";
import jwt from "jsonwebtoken";

const auth=async(req,res,next)=>{
    try {
        //extract the token from the request headers
        const token=req.header('x-auth-token')

        //if no token is provided,return 401(unauthorized) response with an error message
        if(!token) return res.status(401).json({msg:'No authentification token,authorization denied'})

       //verify the jwt token using the secret key
       const verified=jwt.verified(token,"passwordkey")
       //if the token verification failed, return 401,
       if (!verified) return res.status(401).json({msg:"token verification failed"})
      //find the normal user or vendor in the databse using the id stord in the token payload
       const user=await User.findById(verified.id) || Vendor.findById(verified.id)

       if(!user) return res.status(401).json({msg:"User or Vendor not found, authorization denied"})
      //attact the authenticated user(whether a normal user or a vendor) to request objects
      //this make the user's data available to any subsequent middleware or route handlers
      req.user=user

      //also attact the token to the request object in cas is needed later
      //proceed to the next middleware or route handler
      next();
      req.token=token
    } catch (e) {
        res.status(500).json({error:e.message})
    }
}

//Vendor authentificaiton middleware
//This middleware ensures that the user making the request is a vendor
//it should be user for routes that only vendor can access.

const vendorAuth=(req,res,next)=>{
    try {
         //check if the user making the request is a vendor (by cheking the "role" property)
        if(!req.user.role||req.user.role!=="vendor"){
        //if the user is not a venodr, return 403(Forbidden) (response with an error message)
        return res.status(403).json({msg:"Access denied, only vendors are allowed"})
    }

    //if the user is a vendor,procees to the next middleware or route handler
    next();
    } catch (e) {
        return res.status(500).json({msg:e.message})
    }
}
export {auth,vendorAuth};