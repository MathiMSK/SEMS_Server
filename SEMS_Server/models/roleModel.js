import mongoose from "mongoose";

const role =  new mongoose.Schema({
    roleName:{
        type:String,
        required:true
    },
    roleCode:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isBlock:{
        type:Boolean,
        default:false
    },
},  {
    timestamps: true
}
)

const Role=mongoose.model('Role',role)
export default Role;