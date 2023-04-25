import RolemenuAccess from "../models/roleMenuModel.js";

const authZ=async(req,res,next)=>{
    if(req.user.isOwner) return next()
    try {
        let user=await RolemenuAccess.find({roleId:req.user.roleId})
        .populate({ path: 'roleId', model: 'Role' })
        .populate({ path: 'menuId', model: 'Menu' });
        let access=user
        req.user={...req.user ,access}
        next()
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}
 
export default authZ;