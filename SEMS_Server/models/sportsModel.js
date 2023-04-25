import mongoose from "mongoose";

const sports =  new mongoose.Schema({
    genderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gender',
        required:true
      },
    sportsName:{
        type:String,
        required:true
    },
    sportsCode:{
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

const Sports=mongoose.model('Sports',sports)
export default Sports;