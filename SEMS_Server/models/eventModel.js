import mongoose from "mongoose";

const event =  new mongoose.Schema({
    genderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required:true
      },
    sportsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sports',
        required:true
      },
    eventName:{
        type:String,
        required:true
    },
    eventCode:{
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

const Event=mongoose.model('Event',event)
export default Event;