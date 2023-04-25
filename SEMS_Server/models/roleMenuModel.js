import mongoose from "mongoose";


const rolemenu=new mongoose.Schema({
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
        required:true,
    },
    menuId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu',
        required:true
    },
    create:{
        type:Boolean,
        default:false
    },
    get:{
        type:Boolean,
        default:false
    },
    update:{
        type:Boolean,
        default:false
    },
    delete:{
        type:Boolean,
        default:false
    },
});

const RolemenuAccess=mongoose.model('Rolemenu',rolemenu)
export default RolemenuAccess;