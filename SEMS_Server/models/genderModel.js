import mongoose from "mongoose";

const gender =  new mongoose.Schema({
    genderName:{
        type:String,
        required:true
    },
    genderCode:{
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

const Gender=mongoose.model('Gender',gender)
export default Gender;