import express from "express";
import {  getAllUser, login, profile, reg, updateUser,ownerReg , getUserById, deleteUserById } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// eventer reg router
router.post("/ownerreg",ownerReg)

// student reg router
router.post("/reg",reg)
router.post("/login",login)
router.get("/profile",profile)
router.get("/getalluser",auth,getAllUser)
router.put("/updateuser/:id",updateUser)
router.get("/getuserbyid/:id",getUserById)
router.delete("/deleteuser/:id",deleteUserById)


export default router;