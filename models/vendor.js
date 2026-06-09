import mongoose from "mongoose";
const vendorSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    locality:{
        type:String,
        default:""
    },

    role:{
        type:'string',
        default:'vendor'
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate:{
            validator:(value)=>{
                const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return re.test(value);
            },
            message:"Email invalid"
        }
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:(value)=>{
                //Check if password is at least 8 characters long
                return value.length>=8;
            },
            message:'Password must be at least 8 characters long'
        }
    }
})


const Vendor=mongoose.model('Vendor',vendorSchema);
export default Vendor;
