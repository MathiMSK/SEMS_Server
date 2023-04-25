import mongoose from "mongoose";

const department =  new mongoose.Schema({
    deptName:{
        type:String,
        required:true
    },
    deptCode:{
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
    }
},  {
    timestamps: true
})

const Department=mongoose.model('Department',department)
export default Department;