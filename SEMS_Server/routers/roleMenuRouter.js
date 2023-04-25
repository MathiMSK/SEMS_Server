import express from "express";
import { deleteRoleMenu, getAccessForUser, getByIdForAccess, getRoleMenu, getRoleMenuById, newRoleMenu, updateRoleMenu } from "../controllers/roleMenuController.js";
import auth from "../middleware/auth.js";
import authZ from "../middleware/authz.js";
const router = express.Router();

router.post("/createnew",[auth,authZ],newRoleMenu)
router.get("/getall",[auth,authZ],getRoleMenu)
router.get("/getbyid/:id",[auth,authZ],getRoleMenuById)
router.put("/update/:id",[auth,authZ],updateRoleMenu)
router.delete("/delete/:id",[auth,authZ],deleteRoleMenu)
router.get("/getidaccess/:id",[auth,authZ],getByIdForAccess)
router.get("/getaccessforuser",[auth,authZ],getAccessForUser)

export default router