import jwt from 'jsonwebtoken'
import Role from '../models/roleModel.js'
import User from '../models/userModel.js'

async function auth(req,res,next){
    const token=req.header('sems-auth-token')  
    if(!token) return res.status(403).json({message:"forbidden - token is unavailable"}) 
    try {
        const decoded=jwt.verify(token,process.env.JWT)
        req.user=decoded
        let getOwner=await User.findById({_id:req.user.id}).select("isOwner")
        if(getOwner?.isOwner){ 
            req.user={...req.user,isOwner:getOwner?.isOwner}    
            return next()
        }
        let userFound=await User.findById({_id:req.user.id})
        if(!userFound.roleId) return res.status(404).json({message:"Not mapping any role for this user"})
        let validRole=await Role.findById({_id:userFound.roleId}) 
        if(!validRole) return res.status(404).json({message:"role is not found"})
        if(validRole.isActive===false) return res.status(404).json({message:"role is not in active"})
        if(validRole.isBlock===true) return res.status(404).json({message:"role is in block"})
        let user=await User.findById({_id:req.user.id}).populate("roleId")
        req.user={...req.user,...{roleId:user.roleId._id,roleName:user.roleId.roleName,isOwner:user.isOwner}}
        next(); 
    } catch (error) { 
        if (error.message === 'jwt malformed') return res.status(401).json({message:'invalid token or '+error.message})
        res.status(401).json({message:error.message})
    }
}

export default auth;