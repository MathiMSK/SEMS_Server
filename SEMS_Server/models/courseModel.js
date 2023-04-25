import mongoose from "mongoose";

const course =  new mongoose.Schema({
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required:true
      },
    courseName:{
        type:String,
        required:true
    },
    courseCode:{
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

const Course=mongoose.model('Course',course)
export default Course;