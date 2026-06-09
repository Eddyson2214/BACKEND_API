import mongoose from "mongoose";
const userSchema=mongoose.Schema({
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

const User=mongoose.model("User",userSchema);
export default User;