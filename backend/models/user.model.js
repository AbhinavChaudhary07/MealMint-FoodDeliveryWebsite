import mongoose from "mongoose"
const userSchema =new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
    },

    mobile:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        enum:["user","owner","deliveryBoy"],
        required : true
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    socketId:{
        type:String,
        default:null
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },
        coordinates:{
            type:[Number],
            default:[0,0]
        }
    },
    resetOtp:{
        type:String
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date,
    }

},{timestamps:true})



const User = mongoose.model("User",userSchema)
export default User
