import { checkAccessCreate, checkAccessGet, checkAccessUpdate } from "../config/checkAccess.js";
import RolemenuAccess from "../models/roleMenuModel.js";
import Role from "../models/roleModel.js";

export const newRoleMenu = async (req, res) => {
  let menuIdForAccess=req.body.menuIdForAccess
  let obj = await checkAccessCreate(req.user, menuIdForAccess);
  if (obj.access == false && obj.message !== null) return res.status(obj.status).json({ message: obj.message });
  if(!req.body.roleId) return res.status(400).json({message:"Role Id is required"})
  if(!req.body.menuId) return res.status(400).json({message:"Menu Id is required"})
  const role = await Role.findOne({ _id: req.body.roleId });
  if (!role) return res.status(400).json({ message: "Role Invalid" });
  const exRoleMenu = await RolemenuAccess.findOne({
    roleId: req.body.roleId,
    menuId: req.body.menuId,
  });
  if (exRoleMenu) return res.status(400) .json({ message: "This menu already mapped with this role" });
  let roleMenu = new RolemenuAccess({
    roleId: req.body.roleId,
    menuId: req.body.menuId,
    create: req.body.create,
    get: req.body.get,
    update: req.body.update,
    delete: req.body.delete,
  });
  try {
    await roleMenu.save();
    res.status(201).json({ message: "Mapping success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoleMenu = async (req, res) => {
  try {
    const{create,get,update,deleted}=req.query
    const filter={}
    if(create){
        filter.create=create
    }
    if(get){
        filter.get=get
    }
    if(update){
        filter.update=update
    }
    if(deleted){
        filter.delete=deleted
    }
    const roleMenu = await RolemenuAccess.find(filter).populate({ path: 'roleId', model: 'Role' })//.populate({ path: 'menuId', model: 'Menu' });
    if(roleMenu.length === 0) return res.status(400).json({message:"Role menu not found"})
    res.status(200).json({ data: roleMenu });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoleMenuById = async (req, res) => {
  let menu = req.query.menuId;
  let obj = await checkAccessGet(req.user, menu);
  if (obj.access == false && obj.message !== null) return res.status(obj.status).json({ message: obj.message });
  let menuId=req.query.menuId
  try {
    const roleMenu = await RolemenuAccess.find({roleId:req.params.id}).populate({ path: 'roleId', model: 'Role' }).populate({ path: 'menuId', model: 'Menu' });
    if(!roleMenu) return res.status(400).json({message:"Role menu not found"})
    res.status(200).json({ data: roleMenu });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRoleMenu = async (req, res) => {
  let menu = req.body.menuId;
  let obj = await checkAccessUpdate(req.user, menu);
  if (obj.access == false && obj.message !== null) return res.status(obj.status).json({ message: obj.message });
  try {
    const roleMenu = await RolemenuAccess.findById(req.params.id);
    if (!roleMenu) return res.status(400).json({ message: "Role menu not found" });
    const params = Object.keys(req.body);
    const allowedUpdates = ["create", "get", "update", "delete", "menuId"];
    const isValidOperation = params.every((param) =>
      allowedUpdates.includes(param)
    );
    if (!isValidOperation)
      return res.status(400).json({ message: "Invalid updates!" });

    await RolemenuAccess.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "update success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getByIdForAccess = async (req, res) => {
  let arr=[]
  let obj={}
  try {
      let user=await RolemenuAccess.find({roleId:req.params.id}).populate("menuId");
      user.map((i)=>{
        let menu = i.menuId?.menuName
        arr.push({menu,id:i.menuId?._id})
      })
      obj={roleMenuAccess:arr,roleId:req.params.id}
      res.status(200).json({data:obj});
  } catch (error) {
      res.status(400).json({message:error.message});
  }
};

export const deleteRoleMenu = async (req, res) => {
  try {
    const deleted = await RolemenuAccess.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(400).json({ message: "Role menu not found" });
    res.status(200).json({ message: "delete success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAccessForUser = async (req, res) => {
  try {
    let roleId=req.query.roleId
    let menuId=req.query.menuId
    let foundObj={}
    let count=0
    if(req.user.isOwner==true) {
      foundObj={isOwner:true}
      return res.status(200).json({ data: foundObj });
    }
    if(!roleId || roleId=="undefined") return res.status(400).json({ message: "Please provide role id in query" });
    if(!menuId || menuId=="undefined") return res.status(400).json({ message: "Please provide menu id in query" });
    req?.user?.access.filter((item) => {
      if(item.roleId._id==roleId && item.menuId._id==menuId){
        count++
        return foundObj=item
      }
    });
    if(count==0) return res.status(404).json({ message: "Not mapping menu for this role" }); 
    res.status(200).json({ data: foundObj });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};